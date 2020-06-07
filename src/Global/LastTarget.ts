export type LastTargetCondition = (unit: unit, target: unit) => boolean;

export class LastTarget {
    private static _instance: Record<number, LastTarget> = {};

    private target: unit | null = null;
    private condition: LastTargetCondition;

    constructor(condition: LastTargetCondition) {
        this.condition = condition;
    }

    static Register(unit: unit, condition: LastTargetCondition) {
        this._instance[GetHandleId(unit)] = new LastTarget(condition);
    }

    static Get(unit: unit) {
        return this._instance[GetHandleId(unit)].target;
    }

    static init() {
        const t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
        TriggerAddAction(t, () => {
            const unit = GetTriggerUnit();
            const unitId = GetHandleId(unit);
            if (unitId in this._instance) {
                const target = GetOrderTargetUnit();
                if (target && this._instance[unitId].condition(unit, target)) {
                    this._instance[unitId].target = target;
                }
            }
        });
    }
}