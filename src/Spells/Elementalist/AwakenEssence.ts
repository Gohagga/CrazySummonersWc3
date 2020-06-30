import { Log, Units } from "Config";
import { Order } from "Global/Order";
import { SpellEvent } from "Global/SpellEvent";
import { Balance } from "Modules/Globals";
import { SpawnPoint } from "Spells/Spawn";
import { StatWeights } from "Systems/BalanceData";
import { Orb } from "Systems/OrbResource/Orb";
import { OrbType } from "Systems/OrbResource/OrbType";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { UnitCharge } from "Systems/UnitCharge";
import { Point, Unit } from "w3ts/index";
import { EssenceType } from "Classes/EssenceType";

export class AwakenEssence {

    static SpellId: number;
    private static _instance: Record<number, { targetUnit: Unit, targetPoint: Point }> = {};
    private static _essence: Record<number, AwakenEssence> = {};
    private static OrderId = Order.ELEMENTALFURY;
    private static Range = 260;

    constructor(
        public essence: Unit,
        private type: EssenceType,
        private usedOrbs: Orb[],
    ) {
        for (let o of usedOrbs) {
            o.disabled++;
            o.Consume(essence.owner.handle);
            o.cooldownRemaining = 0;
        }
    }

    public Destroy() {
        for (let o of this.usedOrbs) {
            o.disabled--;
        }
    }

    private static readonly EssenceUnit: Record<EssenceType, { type: number }> = {
        [EssenceType.Fire]: { type: Units.FireEssence },
        [EssenceType.Frost]: { type: Units.FrostEssence },
        [EssenceType.Lightning]: { type: Units.LightningEssence },
    }

    static UnitAI(data: UnitCharge) {
        if (GetUnitCurrentOrder(data.unit) == 0) {
            let x = GetLocationX(data.destination);
            let y = GetLocationY(data.destination);
            IssuePointOrderLoc(data.unit, "attack", data.destination);
        }
    }
    
    private static OrbCost: OrbType[] = [];

    private static ApplyStats(
        unit: unit,
        level: number,
        weights: StatWeights
    ) {
        Log.info("Applying stats");
        let u = Unit.fromHandle(unit);

        Log.info("Calculating");
        let stats = Balance.Calculate(level, weights);
            // {
            //     diceTweaks: [0, 0, 0],
            //     dpsVariation: 0,
            //     speed: 1.5,
            //     targetsCount: 1,
            //     targetsMultiplier: 1
            // }

        // Log.info("stats:", stats.armor, stats.hitPoints, stats.baseDamage, stats.diceCount, stats.diceMaxRoll);
        u.maxLife = stats.hitPoints;
        u.life = stats.hitPoints;
        BlzSetUnitArmor(unit, stats.armor);
        if (weights.attack && weights.attack.speed) u.setAttackCooldown(weights.attack.speed, 0);
        u.setBaseDamage(stats.baseDamage, 0);
        u.setDiceNumber(stats.diceCount, 0);
        u.setDiceSides(stats.diceMaxRoll, 0);
        u.name = `${u.name} ${level}`;
    }
    
    public static GetEvent(caster: Unit): { targetUnit: Unit, targetPoint: Point } {
        return this._instance[caster.id];
    }

    public static CleanEvent(caster: Unit) {
        delete this._instance[caster.id];
    }

    public static Check(orderId: number, caster: Unit) {
        let orderTarget = GetOrderTargetUnit();
        let x = (orderTarget && GetUnitX(orderTarget)) || GetOrderPointX();
        let y = (orderTarget && GetUnitY(orderTarget)) || GetOrderPointY();
        if (orderId == this.OrderId &&
            (x - caster.x)*(x - caster.x) + (y - caster.y)*(y - caster.y) < AwakenEssence.Range * AwakenEssence.Range &&
            ResourceBar.Get(caster.owner.handle).CountAvailable(OrbType.Summoning) > 0
        ) {
            return true;
        }
        return false;
    }

    public static ReleaseEssence(type: EssenceType, caster: Unit) {

        if (caster.typeId != this.EssenceUnit[type].type) return;
        caster.show = false;
        // Release resources
        let instance = this._essence[caster.id];
        if (instance) {
            instance.Destroy();
        }

        return { RemoveCaster: () => this.RemoveEssenceCaster(type, caster) };
    }

    public static RemoveEssenceCaster(type: EssenceType, caster: Unit) {
        if (caster.typeId != this.EssenceUnit[type].type) return;
        RemoveUnit(caster.handle);
    }

    public static SpawnEssence(type: EssenceType, spellId: number, level: number, caster: Unit, point: Point): Unit | null  {

        let resource = ResourceBar.Get(caster.owner.handle);
        let usedOrbs = resource.Check(this.OrbCost);
        if (!usedOrbs) return null;

        let essence = new Unit(caster.owner, this.EssenceUnit[type].type, point.x, point.y, 0);
        essence.addAbility(spellId);
        essence.setAbilityLevel(spellId, level);
        let instance = new AwakenEssence(essence, type, usedOrbs);
        this._essence[essence.id] = instance;
        return essence;
    }

    public static SpawnUnit(target: Unit, type: number, level: number, statWeights: StatWeights, caster: Unit): Unit | null {
        let sp = SpawnPoint.FromTarget(target.handle);
        if (!sp) return null;
        
        let resource = ResourceBar.Get(caster.owner.handle);
        // let usedOrbs = resource.Check(this.OrbCost);
        if (resource.Consume(this.OrbCost) == false) return null;

        let data: any = {
            loops: 10,
            spawnPoint: sp,
            unitType: type,
            timer: CreateTimer(),
            unit: CreateUnitAtLoc(sp.owner, type, sp.Point, sp.facing)
        };
        this.ApplyStats(data.unit, level, statWeights);
        RemoveGuardPosition(data.unit);
        SetUnitVertexColor(data.unit, 255, 255, 255, 0);
        SetUnitInvulnerable(data.unit, true);
        
        // let instance = new AwakenEssence(Unit.fromHandle(data.unit), type, usedOrbs);
        // this._essence[data.unit.id] = instance;
        
        UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), sp);

        TimerStart(data.timer, 0.1, true, () => {
            if (data.loops > 0) {
                data.loops--;
                SetUnitVertexColor(data.unit, 255, 255, 255, 255 - data.loops * 25);
            } else {
                SetUnitVertexColor(data.unit, 255, 255, 255, 255);
                PauseTimer(data.timer);
                DestroyTimer(data.timer);
                PauseUnit(data.unit, false);
                SetUnitInvulnerable(data.unit, false);
                data = null;
            }
        });
        return data.unit;
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [ OrbType.Summoning ];
        SpellEvent.RegisterSpellEffect(this.SpellId, () => {
            
            Log.info("Awaken cast");
            let caster = Unit.fromEvent();
            let target = GetSpellTargetUnit();
            let loc = GetSpellTargetLoc();

            if (target) {
                let targetUnit = Unit.fromHandle(target);
                Log.info("Saving instance", targetUnit.name, targetUnit.x, targetUnit.y);
                let instance = { targetUnit, targetPoint: targetUnit.point };
                this._instance[caster.id] = instance;
            } else {
                let point = Point.fromHandle(loc);
                Log.info("Saving instance", '""', point.x, point.y);
                let instance = { targetUnit: null, targetPoint: point };
                this._instance[caster.id] = instance;
            }
        });
    }
}
