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

export class FlameBarrage {
    public static SpellId: number;
    public static readonly IndicatorSfx: string = Models.DominationAura;
    public static readonly MissileSfx: string = Models.OrbOfFire;
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];

    public static UpdatePeriod = 0.03;
    private static AccelerationRate = 1.04

    private speed: number = 500 * FlameBarrage.UpdatePeriod;
    private travelled = 0;
    private timer = new Timer();
    private sfx: Effect;
    private indicatorSfx: Effect;

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

    static ShootFlameOrb(data: { caster: Unit, tx: number, ty: number, radius: number, damage: number }) {

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
                UnitDamageTarget(this.caster.handle, t.handle, this.damage, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
            }
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Blue,
            OrbType.Purple
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            let data = {
                done: false,

                awakened: false,
                damage: 30 + 5 * level,
                radius: 250,
                count: 3 + math.floor((level - 1) * 0.5),
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 1.5,
                launchInterval: 1 - 0.15 * math.floor(level * 0.5),
                timer: new Timer(),
                casterStart: caster.point,
                targetPoint: new Point(x, y),
            }
            Log.info("Flame Barrage cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                // if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

                Log.info("Effect")

                let missileData = {
                    caster,
                    damage: data.damage,
                    radius: data.radius,
                    tx: data.targetPoint.x + caster.x - data.casterStart.x,
                    ty: data.targetPoint.y + caster.y - data.casterStart.y
                };

                this.ShootFlameOrb(missileData);
                data.count--;

                // Start timer to shoot fireballs
                data.timer.start(data.launchInterval, true, () => {
                    if (--data.count < 1) data.timer.destroy();
                    
                    // Shoot a missile
                    this.ShootFlameOrb(missileData);
                });

                Log.info("Has been awakened:", data.awakened);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                Log.info("interrupted", orderId, this.AwakenOrder);
                if (orderId == this.AwakenOrder) {
                    let x = GetOrderPointX();
                    let y = GetOrderPointY();
                    if ((x - caster.x)*(x - caster.x) + (y - caster.y)*(y - caster.y) < AwakenEssence.Range * AwakenEssence.Range) {
                        data.awakened = true;
                        return true;
                    }
                }
                if (!data.done) {
                    data.castSfx.destroy()
                    castBar.Destroy();
                    data.done = true;
                }
                return false;
            });
        });
        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}