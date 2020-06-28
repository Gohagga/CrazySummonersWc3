import { Dummies, Models, Units, Spells, Log } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellHelper } from "Global/SpellHelper";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { OrbType } from "Systems/OrbResource/OrbType";
import { MapPlayer, Point, Timer, Unit, Effect } from "w3ts/index";
import { Chill } from "./Chill";

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
        private damage: number,
        private owner: MapPlayer,
        private radius: number,
        private center: Point,
        private duration: number,
        level: number,
    ) {
        Log.info("Created instance");
        this.dummyCaster = new Unit(owner, Units.DUMMY, 0, 0, 0);
        this.dummyCaster.removeGuardPosition();
        this.dummyCaster.addAbility(Inferno.DummySpellId);
        this.dummyCaster.setAbilityLevel(Inferno.DummySpellId, level);
        this.dummyCaster.issueOrderAt(Inferno.DummyOrder, center.x, center.y);
        this.sfx = new Effect(Inferno.Sfx, center.x, center.y);
        this.sfx.scale = radius * 0.002;
        this.sfx.setHeight(5);
    }

    public Run() {
        this.timer.start(Inferno.Period, true, () => {
            // Log.info("loop");
            let targets = SpellHelper.EnumUnitsInRange(this.center, this.radius, (t) =>
                t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
                t.isHero() == false &&
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

                let instance = new Inferno(data.damage, owner, data.aoe, point, data.duration, level);
                instance.Run();
            });
            Interruptable.Register(caster.handle, (orderId: number) => {

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