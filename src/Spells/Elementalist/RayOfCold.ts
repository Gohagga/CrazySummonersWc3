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
import { Order } from "Global/Order";

export class RayOfCold {
    public static SpellId: number;
    public static readonly Sfx: string = Models.IceBlast;
    public static readonly DamageSfx: string = "Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl";
    public static readonly LightningCode: string = "CHIM";
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];
    static OrderId: number = Order.PHASESHIFTINSTANT;

    private static _instance: Record<number, RayOfCold> = {};
    
    static Width = 30;
    static readonly Period = 0.03;

    private posTimer = new Timer();
    private effectTimer = new Timer();
    private targetAngle: number;
    private lightning: lightning;
    private sourceSfx: Effect;
    private center: Point;
    private dest: Point;
    private distance: number;
    private targets: Unit[] = [];
    constructor(
        private caster: Unit,
        private casterProxy: Unit,
        private origin: Point,
        private maxDistance: number,
        private angleSpeed: number,
        private angle: number,
        private damage: number,
        private pierceCount: number,
    ) {
        this.distance = maxDistance;
        this.targetAngle = angle;

        // Calculate destination point
        let dest = new Point(origin.x + this.distance * Cos(angle), origin.y + this.distance * Sin(angle));
        this.dest = dest;
        this.center = new Point((dest.x + origin.x) * 0.5, (dest.y + origin.y) * 0.5);

        // Create sfx

        print("Adjust first");
        this.AdjustPierce();
        print(this.distance);
        
        // Create lightning
        let x = this.origin.x + this.distance * Cos(angle);
        let y = this.origin.y + this.distance * Sin(angle);
        this.lightning = AddLightningEx(RayOfCold.LightningCode, true, origin.x, origin.y, 60, x, y, 60);
        // this.UpdatePosition();

        this.posTimer.start(RayOfCold.Period, true, () => {
            this.UpdatePosition();
            this.AdjustPierce();
        });
        this.effectTimer.start(0.2, true, () => this.Effect());
    }

    private AdjustPierce() {
        // Get all viable targets
        const targets = SpellHelper.EnumUnitsInRange(this.center, this.maxDistance * 0.6, (t, c) => {
            let k = (this.dest.y - this.origin.y) / (this.dest.x - this.origin.x);
            let x = (k * (k * this.origin.x - this.origin.y + t.y) + t.x) / (k * k + 1);
            let y = k * (x - this.origin.x) + this.origin.y;
            let condition = IsUnitType(t.handle, UNIT_TYPE_HERO) == false &&
                t.life > 0.405 &&
                t.isEnemy(this.caster.owner) &&
                IsUnitInRangeXY(t.handle, x, y, RayOfCold.Width);

            return condition;
        });

        if (targets.length == 0) {
            this.distance = this.maxDistance;
            this.targets = [];
            return;
        }

        let choices: { unit: Unit, priority: number }[] = [];
        for (let u of targets) {
            choices.push({
                unit: u,
                priority: (u.x-this.origin.x)*(u.x-this.origin.x) + (u.y-this.origin.y)*(u.y-this.origin.y)
            });
        }

        let count = this.pierceCount;
        let newTargets: Unit[] = [];
        choices.sort((a, b) => a.priority - b.priority);
        let lastUnit: Unit;

        for (let c of choices) {
            if (count-- == 0) break;

            newTargets.push(c.unit);
            lastUnit = c.unit;
        }
        this.distance = DistanceBetweenPoints(this.caster.point.handle, lastUnit.point.handle);
        print(this.distance);
        this.targets = newTargets;
    }

    private Effect() {
        
        for (let t of this.targets) {
            this.caster.damageTarget(t.handle, this.damage, 0, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
        }
    }

    private UpdatePosition() {

        // Move the lightning according to targetAngle, if it changed
        let angleDiff = this.targetAngle - this.angle;
        if (angleDiff != 0) {
            let da = this.angleSpeed * RayOfCold.Period;
            // print(this.targetAngle, this.angle, angleDiff, da);
            if (da*da > angleDiff*angleDiff) da = angleDiff;
    
            if (angleDiff < 0) {
                da = -da;
            }
    
            let newAngle = this.angle + da;
            this.angle = newAngle;
        }
        let x = this.origin.x + this.distance * Cos(this.angle);
        let y = this.origin.y + this.distance * Sin(this.angle);
        MoveLightningEx(this.lightning, true, this.origin.x, this.origin.y, 60, x, y, 60);
        this.dest.x = x;
        this.dest.y = y;
    }

    public Redirect(angle: number) {

    }

    public Destroy() {
        DestroyLightning(this.lightning);
        this.posTimer.destroy();
        this.effectTimer.destroy();
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Blue
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            if (CastBar.GetUnitCurrentSpellId(caster.handle) == this.SpellId &&
                this._instance[caster.id]
            ) {
                // Recast detected
                this._instance[caster.id].targetAngle = Atan2(y - caster.y, x - caster.x);
                return;
            }

            let data = {
                isCast: false,

                awakened: false,
                damage: 20 + 5 * level,
                aoe: 200 + 50 * level,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 2,
                channelTime: 8,

                distance: 1600,
                angleSpeed: 20 * bj_DEGTORAD,
                pierceCount: 1,
            }
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                let resource = ResourceBar.Get(owner.handle);
                if (!resource.Check(this.OrbCost)) return;
                
                // Create a beam that updates itself
                const ray = new RayOfCold(caster, caster, caster.point, data.distance, data.angleSpeed, Atan2(y - caster.y, x - caster.x), data.damage, data.pierceCount);
                this._instance[caster.id] = ray;
                data.isCast = true;
                // Begin channeling
                let channelBar = new CastBar(caster.handle);
                channelBar.CastSpell(this.SpellId, data.channelTime, () => {
                    channelBar.Finish();
                    ray.Destroy();
                    delete this._instance[caster.id];
                    resource.Consume(this.OrbCost);
                });
                Interruptable.Register(caster.handle, (orderId) => {

                    if (orderId == this.OrderId) {
                        // If spell is recast, redirect the beam
                        // ray.targetAngle = Atan2()
                        return true;
                    } else {
                        // Otherwise, end it
                        channelBar.Destroy();
                        ray.Destroy();
                        delete this._instance[caster.id];
                        resource.Consume(this.OrbCost);
                        return false;
                    }
                });
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (data.isCast) return false;

                data.castSfx.destroy()
                castBar.Destroy();
                return false;
            })
            // let castBar = new CastBar(caster.handle);
            // castBar.CastSpell(this.SpellId, data.castTime, () => {
            //     castBar.Finish();
            //     data.castSfx.destroy();

            //     if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

            //     Log.info("Effect")

            //     let sfx = AddSpecialEffect(this.Sfx, x, y);
            //     BlzSetSpecialEffectScale(sfx, data.aoe * 0.008);
            //     BlzSetSpecialEffectOrientation(sfx, GetRandomReal(0, 3.14), 0, 0);
            //     DestroyEffect(sfx);

            //     let targets = SpellHelper.EnumUnitsInRange(new Point(x, y), data.aoe, (u) => 
            //         u.isAlive() &&
            //         u.isHero() == false &&
            //         u.isAlly(owner) == false);

            //     for (let t of targets) {
            //         UnitDamageTarget(caster.handle, t.handle, data.damage, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
            //         new Effect(this.DamageSfx, t, "origin").destroy();
            //     }

            //     Log.info("Has been awakened:", data.awakened);
            // });
            // Interruptable.Register(caster.handle, (orderId) => {

            //     Log.info("interrupted", orderId, this.AwakenOrder);
            //     if (orderId == this.AwakenOrder) {
            //         let x = GetOrderPointX();
            //         let y = GetOrderPointY();
            //         if ((x - caster.x)*(x - caster.x) + (y - caster.y)*(y - caster.y) < AwakenEssence.Range * AwakenEssence.Range) {
            //             data.awakened = true;
            //             return true;
            //         }
            //     }
            //     if (!data.done) {
            //         data.castSfx.destroy()
            //         castBar.Destroy();
            //         data.done = true;
            //     }
            //     return false;
            // });
        });
        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}