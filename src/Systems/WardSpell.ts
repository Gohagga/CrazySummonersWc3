import { SpawnPoint } from "Spells/Spawn";

export class WardSpell {
    private static _instance: Record<number, WardSpell> = {};

    protected onDestroy = () => {};

    public static RegisterWardTarget(unit: unit, spawnPoint: SpawnPoint) {

        let wardTarget = new WardSpell();
        this._instance[GetHandleId(unit)] = wardTarget;
    }

    public static FromTarget(target: unit) {
        let targetId = GetHandleId(target);
        if (targetId in WardSpell._instance) {
            return WardSpell._instance[targetId];
        }
        return null;
    }

    public static ApplyWard(target: unit, wardSpell: WardSpell) {
        let targetId = GetHandleId(target);
        if (targetId in WardSpell._instance) {
            let previous = WardSpell._instance[targetId];
            previous.onDestroy();
            WardSpell._instance[targetId] = wardSpell;
            return true;
        }
        return false;
    }
}