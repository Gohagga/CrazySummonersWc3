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

export class FlameBarrage {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.FlameBarrage;
    public static SpawnedUnitId: number = Units.Wabba;
    public static readonly IndicatorSfx: string = Models.DominationAura;
    public static readonly MissileSfx: string = Models.OrbOfFire;
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
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
            damage: 10 + 25 * level,
            radius: 250,
            count: 3 + math.floor((level - 1) * 0.5),
            castTime: 1.5,
            launchInterval: 1 - 0.15 * math.floor(level * 0.5),
        }
    }

    public static UpdatePeriod = 0.03;
    private static AccelerationRate = 1.04

    private speed: number = 500 * FlameBarrage.UpdatePeriod;
    private travelled = 0;
    private timer = new Timer();
    private sfx: Effect;
    private indicatorSfx: Effect;
    public releaseEssence = false;

    constructor(
        private caster: Unit,
        private distance: number,
        private angle: number,
        private angleOff: number,
        private damage: number,
        private radius: number,
        private origin: Point,
    ) {
        this.sfx = new Effect(FlameBarrage.MissileSfx, origin.x, origin.y);
    }

    private UpdatePosition() {

        // Update position here
        let progression = this.travelled / this.distance;
        let curve = progression - 0.5;
        let cos = Cos(this.angle);
        let sin = Sin(this.angle);
        curve = (0.2 - curve * curve);

        // Explode if reached the end
        if (progression > 1.0) {
            this.Explode();
            this.timer.destroy();
            return;
        }

        // Accelerate the missile
        this.speed = this.speed * FlameBarrage.AccelerationRate;

        // Calculate delta position
        let dx = this.speed * cos;
        let dy = this.speed * sin;

        // Update position in memory
        this.origin.x += dx;
        this.origin.y += dy;

        // Horizontally curve the missile and calculate effect pos
        let cd = 1500 * curve * this.angleOff;
        let x = this.origin.x + Cos(this.angle + bj_PI * 0.5) * cd;
        let y = this.origin.y + Sin(this.angle + bj_PI * 0.5) * cd;
        let z = 1000.0 * curve * (this.distance * 0.001 + 1);
        
        // Move the effect
        this.sfx.setPosition(x, y, z);
        
        // Update the travelled amount
        this.travelled += this.speed;

        // If has not died
        this.timer.start(FlameBarrage.UpdatePeriod, false, () => {
            this.UpdatePosition();
        });
    }

    static ShootFlameOrb(data: { caster: Unit, tx: number, ty: number, radius: number, damage: number }): FlameBarrage {

        let { caster, tx, ty, radius, damage } = data;
        let x = caster.x;
        let y = caster.y;
        let origin = caster.point;
        let distance = SquareRoot((tx-x)*(tx-x)+(ty-y)*(ty-y));

        let angle = Atan2(ty - y, tx - x);
        let angleOffset = Cos(caster.facing * bj_DEGTORAD + bj_PI * 0.5 - angle);
        
        let instance = new FlameBarrage(caster, distance, angle, angleOffset, damage, radius, origin);
        instance.indicatorSfx = new Effect(FlameBarrage.IndicatorSfx, tx, ty);
        instance.indicatorSfx.scale = radius * 0.02;
        instance.indicatorSfx.setAlpha(160);
        instance.UpdatePosition();
        return instance;
    }

    private Explode() {
        this.sfx.destroy();
        this.indicatorSfx.destroy();

        let targets = SpellHelper.EnumUnitsInRange(this.origin, this.radius, (t, c) => {
            return t.life > 0.405 &&
                t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
                t.isEnemy(this.caster.owner);
        });

        for (let t of targets) {
            if (t.isHero()) {
                UnitDamageTarget(this.caster.handle, t.handle, 1, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
            } else {
                Chill.Remove(t, 1);
                UnitDamageTarget(this.caster.handle, t.handle, this.damage, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
            }
        }

        if (this.releaseEssence) AwakenEssence.RemoveEssenceCaster(FlameBarrage.Type, this.caster);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Red,
            OrbType.Blue
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);

            let data = this.Data({level})
            let inst = {
                done: false,
                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                timer: new Timer(),
                casterStart: caster.point,
                targetPoint: new Point(x, y),
            }
            Log.info("Flame Barrage cast");
            
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
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        let essence = AwakenEssence.SpawnEssence(this.Type, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);
                Log.info("Effect", data.count)

                let missileData = {
                    caster,
                    damage: data.damage,
                    radius: data.radius,
                    tx: inst.targetPoint.x + caster.x - inst.casterStart.x,
                    ty: inst.targetPoint.y + caster.y - inst.casterStart.y,
                };

                this.ShootFlameOrb(missileData);
                data.count--;

                // Start timer to shoot fireballs
                inst.timer.start(data.launchInterval, true, () => {
                    
                    missileData.tx = inst.targetPoint.x + caster.x - inst.casterStart.x;
                    missileData.ty = inst.targetPoint.y + caster.y - inst.casterStart.y;
                    
                    // Shoot a missile
                    let instance = this.ShootFlameOrb(missileData);
                    if (--data.count < 1) {
                        inst.timer.destroy();
                        instance.releaseEssence = true;
                        AwakenEssence.ReleaseEssence(this.Type, caster);
                    }
                });
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
        this.FreeSpellId = FourCC('A03V');
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