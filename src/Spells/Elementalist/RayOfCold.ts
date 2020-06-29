import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, Effect, Point, Timer } from "w3ts/index";
import { AwakenEssence, EssenceType } from "./AwakenEssence";
import { SpellHelper } from "Global/SpellHelper";
import { Order } from "Global/Order";
import { Chill } from "./Chill";
import { StatWeights } from "Systems/BalanceData";

export class RayOfCold {
    public static SpellId: number;
    public static SpawnedUnitId: number = Units.Dinkie;
    public static readonly Sfx: string = Models.IceBlast;
    public static readonly DamageSfx: string = "Abilities\\Weapons\\LichMissile\\LichMissile.mdl";
    public static readonly BeamEndSfx: string = "Abilities\\Spells\\Other\\BreathOfFrost\\BreathOfFrostTarget.mdl";
    public static readonly OriginSfx: string = Models.CastIceRay;
    public static readonly LightningCode: string = "COBM";
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];
    static OrderId: number = Order.PHASESHIFTINSTANT;
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

    private static _instance: Record<number, RayOfCold> = {};
    
    static Width = 30;
    static readonly Period = 0.03;
    static readonly DamageInterval = 0.2;

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
        this.sourceSfx = new Effect(RayOfCold.OriginSfx, origin.x, origin.y);
        this.sourceSfx.scale = 1.15;
        this.sourceSfx.setYaw(angle);

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
        this.effectTimer.start(RayOfCold.DamageInterval, true, () => this.Effect());
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
            if (Chill.IsFrozen(c.unit)) count++;
            if (count-- == 0) break;

            newTargets.push(c.unit);
            lastUnit = c.unit;
        }
        this.distance = DistanceBetweenPoints(this.caster.point.handle, lastUnit.point.handle);
        this.targets = newTargets;
    }

    private Effect() {
        
        for (let t of this.targets) {
            this.caster.damageTarget(t.handle, this.damage, 0, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
            new Effect(RayOfCold.DamageSfx, t, "origin").destroy();
            Chill.ApplyToMax(t, 1, 8);
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
            this.sourceSfx.setYaw(this.angle);
        }
        let cos = Cos(this.angle);
        let sin = Sin(this.angle);
        let x = this.origin.x + this.distance * cos;
        let y = this.origin.y + this.distance * sin;
        MoveLightningEx(this.lightning, true, this.origin.x, this.origin.y, 60, x, y, 60);
        this.dest.x = x;
        this.dest.y = y;
        // let end = new Effect(RayOfCold.BeamEndSfx, this.origin.x + (this.distance - 20)*cos, this.origin.y + (this.distance - 20)*sin);
        // end.setHeight(60);
        // end.destroy();
    }

    public Redirect(x: number, y: number) {
        this.targetAngle = Atan2(y - this.origin.y, x - this.origin.x);
    }

    public Destroy() {
        DestroyLightning(this.lightning);
        this.posTimer.destroy();
        this.effectTimer.destroy();
        this.sourceSfx.destroy();
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Blue,
            OrbType.Purple,
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            if (this._instance[caster.id]) {
                print("Recast detected");
                // Recast detected
                this._instance[caster.id].Redirect(x, y);
                return;
            }

            let data = {
                isCast: false,

                awakened: false,
                damage: 10 + level * 1.5,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 2,
                channelTime: 8,

                distance: 1600,
                angleSpeed: (12 + 8 * level) * bj_DEGTORAD,
                pierceCount: 1 + math.floor((level + 1) / 3),
            }
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                let resource = ResourceBar.Get(owner.handle);
                if (!(paid || resource.Consume(this.OrbCost))) return;
                
                if (data.awakened) {
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        AwakenEssence.SpawnEssence(EssenceType.Frost, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);

                // Create a beam that updates itself
                let origin = Point.fromHandle(PolarProjectionBJ(caster.point.handle, 100, caster.facing));

                const ray = new RayOfCold(caster, caster, origin, data.distance, data.angleSpeed, Atan2(y - origin.y, x - origin.x), data.damage, data.pierceCount);
                this._instance[caster.id] = ray;

                data.isCast = true;
                // Begin channeling
                let channelBar = new CastBar(caster.handle);
                let isFinished = false;
                channelBar.CastSpell(this.SpellId, data.channelTime, () => {
                    channelBar.Finish();
                    ray.Destroy();
                    isFinished = true;
                    delete this._instance[caster.id];
                    resource.Consume(this.OrbCost);
                    AwakenEssence.ReleaseEssence(EssenceType.Frost, caster).RemoveCaster();
                });
                Interruptable.Register(caster.handle, (orderId) => {

                    if (orderId == this.OrderId) {
                        // If spell is recast, redirect the beam
                        return true;
                    } else if (isFinished) {
                        return false;
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

                if (AwakenEssence.Check(orderId, caster)) {
                    data.awakened = true;
                    return true;
                }
                if (data.isCast) return false;

                data.castSfx.destroy();
                castBar.Destroy();
                return false;
            });
        };
        this.FreeSpellId = FourCC('A040');
        SpellEvent.RegisterSpellCast(this.SpellId, () => actions(false));
        SpellEvent.RegisterSpellCast(this.FreeSpellId, () => actions(true));

        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
            BlzSetAbilityExtendedTooltip(this.FreeSpellId, tooltip, i);
        }
    }
}