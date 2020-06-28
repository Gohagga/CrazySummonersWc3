import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units } from "Config";
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

export class IonicConversion {
    public static SpellId: number;
    public static readonly AuraId = Auras.IonicConversionSpeed;
    public static readonly BuffId = Buffs.IonicConversion;
    public static readonly HitSfx: string = "Abilities\\Spells\\Orc\\Purge\\PurgeBuffTarget.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];

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
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Blue,
            OrbType.Purple
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const target = Unit.fromHandle(GetSpellTargetUnit());
            const owner = caster.owner;
            let level = caster.getAbilityLevel(this.SpellId);
            const sp = SpawnPoint.FromTarget(target.handle);

            if (!sp) {
                return;
            };

            let data = {
                done: false,

                awakened: false,
                interval: 2.3 - 0.3 * level,
                duration: 9,// 9 - ((level - 1)/ 2) * 2,
                maxSpeedLevel: 3,//math.floor((level - 1) * 0.5) + 3,
                movePerPoint: 300, // 750.0 - level * 50.0
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 2,
                timer: new Timer(),
            }
            Log.info("Ionic Conversion cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();
                data.done = true;

                // if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

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

                Log.info("Has been awakened:", data.awakened);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster, GetOrderPointX(), GetOrderPointY())) {
                    data.awakened = true;
                }

                if (data.done) return false;
                
                data.castSfx.destroy()
                castBar.Destroy();
                data.done = true;
                return false;
            });
        });
        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}