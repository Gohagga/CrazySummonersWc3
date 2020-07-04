import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units, Tooltips } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, Effect, Point, Timer } from "w3ts/index";
import { AwakenEssence } from "./AwakenEssence";
import { SpellHelper } from "Global/SpellHelper";
import { Chill } from "./Chill";
import { StatWeights } from "Systems/BalanceData";
import { EssenceType } from "Classes/EssenceType";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";

export class FrostNova {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.FrostNova;
    public static SpawnedUnitId: number = Units.DaWoop;
    public static readonly Sfx: string = Models.FrostNova;
    public static readonly HitSfx: string = "Abilities\\Weapons\\LichMissile\\LichMissile.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];
    public static Type: EssenceType = EssenceType.Frost;
    static FreeSpellId: number;

    private static SpawnedUnitWeights: StatWeights = {
        offenseRatio: 0.35,
        defenseRatio: 0.6,
        defense: {
            armorGrowth: 0,
            armorRatio: 0
        },
        attack: {
            speed: 1.5,
            dpsVariation: 0.14,
            targetsCount: 1,
            targetsMultiplier: 1,
            diceTweaks: [20, 20, 0.1]
        }
    };

    private static Data(context: Record<string, any>) {
        let { level, caster } = context as { level: number, caster: Unit };
        return {
            damage: 80 + 45 * level,
            aoe: 300,
            duration: 5 + level,
            castTime: 2.5,
        }
    }

    public static readonly Period = 2;
    public static readonly Delay = 1.55;

    private timer = new Timer();
    private sfx: Effect;

    constructor(
        private caster: Unit,
        private point: Point,
        private radius: number,
        private duration: number,
        private damage: number,
    ) {
        this.sfx = new Effect(FrostNova.Sfx, point.x, point.y);
        this.sfx.scale = radius * 0.006;
        
        let t = new Timer();
        t.start(FrostNova.Delay, false, () => {
            this.DropCrystals();
            t.destroy();
        });
    }

    private DropCrystals() {
        let targets = SpellHelper.EnumUnitsInRange(this.point, this.radius + 150, (t) =>
            t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
            t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
            t.isHero() == false &&
            t.inRangeOfPoint(this.point, this.radius) &&
            t.life > 0.405);

        for (let t of targets) {
            if (t.isEnemy(this.caster.owner)) {
                UnitDamageTarget(this.caster.handle, t.handle, this.damage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
            }
        }
    }

    private Run() {
        this.timer.start(FrostNova.Period, true, () => {
            // Log.info("loop");
            let targets = SpellHelper.EnumUnitsInRange(this.point, this.radius + 150, (t) =>
                t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
                t.isHero() == false &&
                t.inRangeOfPoint(this.point, this.radius) &&
                t.life > 0.405);

            for (let t of targets) {
                if (t.isEnemy(this.caster.owner)) {
                    Chill.Apply(t, 1);
                    new Effect(FrostNova.HitSfx, t, "origin").destroy();
                }
            }

            this.duration -= FrostNova.Period;
            if (this.duration <= 0) this.End();
        });
    }

    private End() {
        this.sfx.destroy();
        this.timer.pause();
        this.timer.destroy();
        AwakenEssence.RemoveEssenceCaster(EssenceType.Frost, this.caster);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Blue,
            OrbType.Blue,
            OrbType.Red
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const targetPoint = Point.fromHandle(GetSpellTargetLoc());
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);

            let data = this.Data({level});
            let inst = {
                done: false,
                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
            }
            Log.info("Frost Nova cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                inst.castSfx.destroy();

                if (paid) {
                    // Continue
                } else if (ElementalistMastery.Consume(caster) || ResourceBar.Get(owner.handle).Consume(this.OrbCost)) {
                    ElementalistMastery.Get(caster).AddExperience(this.Type, this.OrbCost.length);
                } else return;

                if (inst.awakened) {
                    Log.info("calling awaken");
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        AwakenEssence.SpawnEssence(EssenceType.Frost, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);
                Log.info("Effect")

                let instance = new FrostNova(caster, targetPoint, data.aoe, data.duration, data.damage);
                instance.Run();
                
                AwakenEssence.ReleaseEssence(EssenceType.Frost, caster);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    inst.awakened = true;
                    return true;
                }
                
                if (!inst.done) {
                    inst.castSfx.destroy()
                    castBar.Destroy();
                    inst.done = true;
                }
                return false;
            });
        };
        SpellEvent.RegisterSpellCast(this.SpellId, () => actions(false));
        this.FreeSpellId = FourCC('A03W');
        SpellEvent.RegisterSpellCast(this.FreeSpellId, () => actions(true));

        for (let i = 0; i < 7; i++) {
            let data = this.Data({ level: i+1 }) as Record<string, any>;
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + TextRenderer.Render(this.Tooltip, data);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
            BlzSetAbilityExtendedTooltip(this.FreeSpellId, tooltip, i);
        }
    }
}