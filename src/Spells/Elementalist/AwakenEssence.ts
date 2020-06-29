import { Unit, Point, Trigger } from "w3ts/index";
import { Orders, Units, Log } from "Config";
import { Order } from "Global/Order";
import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Orb } from "Systems/OrbResource/Orb";
import { UnitCharge } from "Systems/UnitCharge";
import { Balance } from "Modules/Globals";
import { AttackStats, DefenseStats, StatWeights } from "Systems/BalanceData";

export const enum EssenceType {
    Fire,
    Frost,
    Lightning
}

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
            (x - caster.x)*(x - caster.x) + (y - caster.y)*(y - caster.y) < AwakenEssence.Range * AwakenEssence.Range
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

    public static SpawnEssence(type: EssenceType, spellId: number, level: number, caster: Unit, point: Point): Unit {

        let resource = ResourceBar.Get(caster.owner.handle);
        let usedOrbs = resource.Check(this.OrbCost);
        if (!usedOrbs) return null;
        print("usedOrbs", usedOrbs.length);

        let essence = new Unit(caster.owner, this.EssenceUnit[type].type, point.x, point.y, 0);
        essence.addAbility(spellId);
        essence.setAbilityLevel(spellId, level);
        print(1)
        let instance = new AwakenEssence(essence, type, usedOrbs);
        print(2)
        this._essence[essence.id] = instance;
        return essence;
    }

    public static SpawnUnit(target: Unit, type: number, level: number, statWeights: StatWeights) {
        let sp = SpawnPoint.FromTarget(target.handle);
        if (!sp) return;

        let data: any = {
            loops: 10,
            spawnPoint: sp,
            unitType: type,
            timer: CreateTimer(),
            unit: CreateUnitAtLoc(sp.owner, type, sp.Point, sp.facing)
        };
        this.ApplyStats(data.unit, level, statWeights);
        
        UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), sp);

        RemoveGuardPosition(data.unit);
        SetUnitVertexColor(data.unit, 255, 255, 255, 0);
        SetUnitInvulnerable(data.unit, true);

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
