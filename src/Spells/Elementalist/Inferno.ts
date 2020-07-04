import { Dummies, Models, Units, Spells, Log, Tooltips, Buffs } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellHelper } from "Global/SpellHelper";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { OrbType } from "Systems/OrbResource/OrbType";
import { MapPlayer, Point, Timer, Unit, Effect } from "w3ts/index";
import { Chill } from "./Chill";
import { AwakenEssence } from "./AwakenEssence";
import { StatWeights } from "Systems/BalanceData";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { EssenceType } from "Classes/EssenceType";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";

export class Inferno {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.Inferno;
    public static SpawnedUnitId: number = Units.Shoop;
    public static readonly DummySpellId = Dummies.Inferno;
    public static readonly DummyOrder = "deathanddecay";
    public static readonly DamageSfx: string = "Abilities\\Weapons\\RedDragonBreath\\RedDragonMissile.mdl";
    public static readonly Sfx: string = "Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];
    public static Type: EssenceType = EssenceType.Fire;
    static FreeSpellId: number;

    private static SpawnedUnitWeights: StatWeights = {
        offenseRatio: 0.48,
        defenseRatio: 0.42,
        defense: {
            armorGrowth: 0,
            armorRatio: 0
        },
        attack: {
            speed: 1.7,
            dpsVariation: 0.14,
            targetsCount: 1,
            targetsMultiplier: 1,
            diceTweaks: [15, 15, 1]
        }
    };

    private static Data(context: Record<string, any>) {
        let { level } = context as { level: number };
        return {
            aoe: 240 + 60 * level,
            damage: 10 + 5 * level,
            duration: 10 + 2 * level,
            castTime: 3.5,
        }
    }

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
        AwakenEssence.RemoveEssenceCaster(Inferno.Type, this.caster);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Purple,
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const point = Point.fromHandle(GetSpellTargetLoc());
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);

            let data = this.Data({level});
            let inst = {
                done: false,
                awakened: false,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster.handle, "origin"),
            };
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                DestroyEffect(inst.castSfx);

                if (paid) {
                    // Continue
                } else if (ElementalistMastery.Consume(caster) || ResourceBar.Get(owner.handle).Consume(this.OrbCost)) {
                    ElementalistMastery.Get(caster).AddExperience(this.Type, this.OrbCost.length);
                } else return;

                if (inst.awakened) {
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        let essence = AwakenEssence.SpawnEssence(this.Type, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);

                let instance = new Inferno(caster, data.damage, owner, data.aoe, point, data.duration, level);
                instance.Run();
                AwakenEssence.ReleaseEssence(this.Type, caster);
            });
            Interruptable.Register(caster.handle, (orderId: number) => {
                
                if (AwakenEssence.Check(orderId, caster)) {
                    inst.awakened = true;
                    return true;
                }

                if (inst.done == false) {
                    DestroyEffect(inst.castSfx);
                    castBar.Destroy();
                    inst.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        };

        this.FreeSpellId = FourCC('A03X');
        SpellEvent.RegisterSpellCast(this.SpellId, () => actions(false));
        SpellEvent.RegisterSpellCast(this.FreeSpellId, () => actions(true));

        for (let i = 0; i < 7; i++) {
            let data = this.Data({ level: i+1 }) as Record<string, any>;
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + TextRenderer.Render(this.Tooltip, data);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
            BlzSetAbilityExtendedTooltip(this.FreeSpellId, tooltip, i);
        }
    }
}