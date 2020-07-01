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
import { SpawnPoint } from "Spells/Spawn";
import { StatWeights } from "Systems/BalanceData";
import { EssenceType } from "Classes/EssenceType";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";

export class IonicConversion {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.IonicConversion;
    public static SpawnedUnitId: number = Units.Boop;
    public static readonly AuraId = Auras.IonicConversionSpeed;
    public static readonly BuffId = Buffs.IonicConversion;
    public static readonly HitSfx: string = "Abilities\\Spells\\Orc\\Purge\\PurgeBuffTarget.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];
    public static Type: EssenceType = EssenceType.Lightning;
    static FreeSpellId: number;

    private static SpawnedUnitWeights: StatWeights = {
        offenseRatio: 0.6,
        defenseRatio: 0.45,
        defense: {
            armorGrowth: 0,
            armorRatio: 0
        },
        attack: {
            speed: 1.125,
            dpsVariation: 0.35,
            targetsCount: 1,
            targetsMultiplier: 1,
            diceTweaks: [20, 20, 0.1]
        }
    };

    private static Data(context: Record<string, any>) {
        let { level } = context as { level: number };
        return {
            interval: 2 - 0.3 * math.floor(level * 0.5),
            duration: 8.5 - 1.2 * math.floor(level * 0.5),
            maxSpeedLevel: [3, 3, 3, 3, 4, 4, 4, 4][level],
            movePerPoint: 300, // 750.0 - level * 50.0
            castTime: 2,
        }
    }

    private static readonly Period = 0.2;

    private unitData: Record<number, { prevPoint: Point, total: number }> = {};
    private targets: Unit[] = [];
    private timer = new Timer();
    private effectTimer = new Timer();

    constructor(
        private caster: Unit,
        private interval: number,
        private duration: number,
        private region: rect,
        private maxSpeedLevel: number,
        private movePerPoint: number,
    ) {
        this.Update();
        this.timer.start(IonicConversion.Period, true, () => this.Update());
    }

    private Update() {

        print("update");
        if (this.caster.life <= 0.405 ||
            this.duration <= 0
        ) { 
            this.End();
        }

        let targets = SpellHelper.EnumUnitsInRegion(this.region, (t) =>
            t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
            t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
            t.isHero() == false &&
            t.life > 0.405);
        
        for (let t of targets) {
            if (t.id in this.unitData == false) {
                this.unitData[t.id] = { total: 0, prevPoint: t.point };
                this.targets.push(t);
            }
        }

        for (let t of this.targets) {

            let id = t.id;
            let data = this.unitData[id];

            let pos = t.point;
            let moved = DistanceBetweenPoints(data.prevPoint.handle, pos.handle);
            data.total += moved;
            data.prevPoint = pos;

            if (data.total >= this.movePerPoint) {
                data.total -= this.movePerPoint;
                this.CasterBonus();
            };
            this.unitData[id] = data;
        }

        this.duration -= IonicConversion.Period;
    }

    private CasterBonus() {
        Log.info("Caster bonus");
        let bar = ResourceBar.Get(this.caster.owner.handle);

        for (let o of bar.Orbs) {

            if (o.isAvailable == false) {
                o.cooldownRemaining -= 1;
            }
        }
    }

    private Run() {
        
        let remaining: Unit[] = [];
        for (let t of this.targets) {

            // If unit has died in the meantime, remove it from list of valid targets
            if (t.life <= 0.405) {
                delete this.unitData[t.id];
                continue;
            }

            // Do effect on the unit
            new Effect(IonicConversion.HitSfx, t, "origin").destroy();
            let speedLvl = t.getAbilityLevel(IonicConversion.AuraId);
            if (speedLvl > 0 && speedLvl < this.maxSpeedLevel) {
                // print("+1");
                t.setAbilityLevel(IonicConversion.AuraId, speedLvl + 1);
            } else {
                // print("add");
                t.addAbility(IonicConversion.AuraId);
            }

            remaining.push(t);
        }
        this.targets = remaining;

        this.effectTimer.start(this.interval, false, () => this.Run());
    }

    private End() {
        for (let t of this.targets) {
            t.removeAbility(IonicConversion.AuraId);
        }
        this.timer.destroy();
        this.effectTimer.destroy();
        AwakenEssence.RemoveEssenceCaster(EssenceType.Frost, this.caster);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Purple,
            OrbType.Blue,
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const target = Unit.fromHandle(GetSpellTargetUnit());
            const owner = caster.owner;
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);
            const sp = SpawnPoint.FromTarget(target.handle);

            if (!sp) {
                return;
            };

            let data = this.Data({level});
            let inst = {
                done: false,
                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                timer: new Timer(),
            }
            Log.info("Ionic Conversion cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                inst.castSfx.destroy();
                inst.done = true;

                if (!paid && ResourceBar.Get(owner.handle).Consume(this.OrbCost)) {
                    ElementalistMastery.Get(caster).AddExperience(this.Type, this.OrbCost.length);
                } else if (!paid) return;

                if (inst.awakened) {
                    Log.info("calling awaken");
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        AwakenEssence.SpawnEssence(EssenceType.Lightning, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);

                let instance = new IonicConversion(caster, data.interval, data.duration, sp.region, data.maxSpeedLevel, data.movePerPoint);
                instance.Run();

                let channelBar = new CastBar(caster.handle);
                channelBar.CastSpell(this.SpellId, data.duration, () => {
                    channelBar.Finish();
                    // instance.End();
                });
                Interruptable.Register(caster.handle, (orderId) => {
                    instance.End();
                    channelBar.Destroy();
                    return false;
                });

                AwakenEssence.ReleaseEssence(EssenceType.Lightning, caster);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    inst.awakened = true;
                    return true;
                }

                if (inst.done) return false;
                
                inst.castSfx.destroy()
                castBar.Destroy();
                inst.done = true;
                return false;
            });
        };

        this.FreeSpellId = FourCC('A03Y');
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