export type TriggeredMissileCallback = (data: TriggeredMissile) => void;

export class TriggeredMissile {
    private static _missileData: Record<number, TriggeredMissile> = {};
    private static DummyId: number;

    public caster: unit;
    public level: number;
    public spellId: number;
    private doCallback: TriggeredMissileCallback = () => null;
    private orderId: number;

    constructor(caster: unit, spellId: number, orderId: number, level: number) {
        this.caster = caster;
        this.level = level;
        this.spellId = spellId;
        this.orderId = orderId;
    }

    public CastAtTargetAndDo(target: unit, doCallback: TriggeredMissileCallback) {
        const owner = GetOwningPlayer(this.caster);
        const dummy = CreateUnit(owner, TriggeredMissile.DummyId, GetUnitX(this.caster), GetUnitY(this.caster), 0);
        UnitAddAbility(dummy, this.spellId);
        SetUnitAbilityLevel(dummy, this.spellId, this.level);
        TriggeredMissile._missileData[GetHandleId(dummy)] = this;
        
        this.doCallback = doCallback;
        IssueTargetOrderById(dummy, this.orderId, target);
    }

    public static init(dummyId: number) {
        this.DummyId = dummyId;

        const t = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED)
        TriggerAddAction(t, () => {
            const sourceId = GetHandleId(GetEventDamageSource())
            if (sourceId in TriggeredMissile._missileData) {
                const data = TriggeredMissile._missileData[sourceId];
                data.doCallback(data)
                delete TriggeredMissile._missileData[sourceId];
            }
        });
    }
}