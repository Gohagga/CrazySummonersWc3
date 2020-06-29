import { Dummies, Models, Units, Spells, Log } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellHelper } from "Global/SpellHelper";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { OrbType } from "Systems/OrbResource/OrbType";
import { MapPlayer, Point, Timer, Unit, Effect } from "w3ts/index";
import { Chill } from "./Chill";
import { AwakenEssence, EssenceType } from "./AwakenEssence";

export class Inferno {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Inferno;
    public static readonly DummyOrder = "deathanddecay";
    public static readonly DamageSfx: string = "Abilities\\Weapons\\RedDragonBreath\\RedDragonMissile.mdl";
    public static readonly Sfx: string = "Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];

    private static readonly Period = 1;

    private dummyCaster: Unit;
    private timer = new Timer();
    private sfx: Effect;

    constructor(
        private caster: Unit,
        private damage: number,
        private owner: MapPlayer,
        private radius: number,
        private point: Point,
        private duration: number,
        level: number,
    ) {
        Log.info("Created instance");
        this.dummyCaster = new Unit(owner, Units.DUMMY, 0, 0, 0);
        this.dummyCaster.removeGuardPosition();
        this.dummyCaster.addAbility(Inferno.DummySpellId);
        this.dummyCaster.setAbilityLevel(Inferno.DummySpellId, level);
        this.dummyCaster.issueOrderAt(Inferno.DummyOrder, point.x, point.y);
        this.sfx = new Effect(Inferno.Sfx, point.x, point.y);
        this.sfx.scale = radius * 0.002;
        this.sfx.setHeight(5);
    }

    public Run() {
        this.timer.start(Inferno.Period, true, () => {
            // Log.info("loop");
            let targets = SpellHelper.EnumUnitsInRange(this.point, this.radius + 150, (t) =>
                t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
                t.isHero() == false &&
                t.inRangeOfPoint(this.point, this.radius) &&
                t.life > 0.405);

            for (let t of targets) {
                if (t.isEnemy(this.owner)) {
                    UnitDamageTarget(this.dummyCaster.handle, t.handle, this.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                }
                Chill.Remove(t, 1);
            }

            this.duration -= Inferno.Period;
            if (this.duration <= 0) this.End();
        });
    }

    public End() {
        this.timer.pause();
        this.timer.destroy();
        this.sfx.destroy();
        RemoveUnit(this.dummyCaster.handle);
        AwakenEssence.RemoveEssenceCaster(EssenceType.Fire, this.caster);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Purple,
            OrbType.Blue,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const point = Point.fromHandle(GetSpellTargetLoc());
            let level = caster.getAbilityLevel(this.SpellId) + caster.getAbilityLevel(Spells.ElementalFocusRed) + caster.getAbilityLevel(Spells.ElementalFocusPurple);

            let data = {
                done: false,
                awakened: false,

                aoe: 240 + 60 * level,
                damage: 10 + 5 * level,
                healing: 0.02,
                duration: 12 + 3 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster.handle, "origin"),
                castTime: 3.5,
            };
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                DestroyEffect(data.castSfx);

                // if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

                if (data.awakened) {
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        // Spawn a fireball unit here
                    } else {
                        let essence = AwakenEssence.SpawnEssence(EssenceType.Fire, this.SpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);

                let instance = new Inferno(caster, data.damage, owner, data.aoe, point, data.duration, level);
                instance.Run();
                AwakenEssence.ReleaseEssence(EssenceType.Fire, caster);
            });
            Interruptable.Register(caster.handle, (orderId: number) => {
                
                if (AwakenEssence.Check(orderId, caster, GetOrderPointX(), GetOrderPointY())) {
                    data.awakened = true;
                    return true;
                }

                if (data.done == false) {
                    DestroyEffect(data.castSfx);
                    castBar.Destroy();
                    data.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
        for (let i = 0; i < 4; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}