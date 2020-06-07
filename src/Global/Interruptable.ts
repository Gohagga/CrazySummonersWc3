export type InterruptableCondition = (orderId: number) => boolean

export class Interruptable {
    private static _instance: Record<number, InterruptableCondition[]> = {}

    public static Register(unit: unit, condition: InterruptableCondition) {
        
        const unitId = GetHandleId(unit);
        if (!(unitId in Interruptable._instance)) {
            Interruptable._instance[unitId] = [];
        }
        Interruptable._instance[unitId].push(condition);
    }

    static init() {
        const t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_ORDER);
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
        TriggerAddAction(t, () => {

            const unit = GetTriggerUnit();
            const unitId = GetHandleId(unit);
            if (!(unitId !in this._instance)) return;
            const instance = this._instance[unitId];
            let remaining: InterruptableCondition[] = [];
            let order = GetIssuedOrderId();

            if (instance.length > 0) {
                if ((order+'').substr(0, 6) == "109367") return;
            }

            for (let i = 0; i < instance.length; i++) {
                if (instance[i](GetIssuedOrderId())) {
                    remaining.push(instance[i]);
                }
            }
            this._instance[unitId] = remaining;
        })
    }
}