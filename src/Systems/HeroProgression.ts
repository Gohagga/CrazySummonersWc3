export abstract class HeroProgression {
    private static _instance: Record<number, LuaThread> = {};

    abstract ProgressFunction(unit: unit): void;

    protected unit: unit;
    constructor(unit: unit) {
        this.unit = unit;
    }

    public static Register(instance: HeroProgression) {

        const unitId = GetHandleId(instance.unit);
        let c = coroutine.create((unit: unit) => instance.ProgressFunction(unit));
        coroutine.resume(c, instance.unit);
        HeroProgression._instance[unitId] = c;
    }

    public static WaitForUnitLevel(unit: unit, level: number) {
        while (GetUnitLevel(unit) < level) {
            coroutine.yield();
        }
    }

    static init() {

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_LEVEL);
        TriggerAddAction(t, () => {

            let unit = GetTriggerUnit();
            let unitId = GetHandleId(unit);
            if (HeroProgression._instance[unitId]) {
                coroutine.resume(HeroProgression._instance[unitId], unit);
            }
        });
    }
}