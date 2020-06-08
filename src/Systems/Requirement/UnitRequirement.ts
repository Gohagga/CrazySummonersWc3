import { IRequirement } from "./IRequirement";

export class UnitRequirement implements IRequirement {
    
    private unitTypes: number[];

    private instances: {
        level: number,
        unit: Record<number, unit[]>
    }

    constructor(unitTypes: number[]) {
        this.unitTypes = unitTypes;
    }

    Get(unit: unit): number {
        return this.instances[GetHandleId(unit)];
    }

    Increase(unit: unit, amount: number = 1): number {
        
        const instance = this.instances[GetHandleId(unit)];
        const targetLvl = instance.level + amount;

        if (targetLvl < instance.level) return 0;

        const owner = GetOwningPlayer(unit);
        for (let i = instance.level; i < targetLvl; i++) {
            instance.unit[i] = CreateUnit(owner, this.unitTypes[i], 0, 0, 0);
        }
    }

    Decrease(unit: unit, amount: number = 1): number {
        
        const instance = this.instances[GetHandleId(unit)];
        const targetLvl = instance.level - amount;

        if (targetLvl > instance.level) return 0;

        const owner = GetOwningPlayer(unit);
        for (let i = instance.level; i > targetLvl; i--) {
            RemoveUnit(instance.unit[i]);
        }
    }

    Set(unit: unit, amount: number): boolean {

        const id = GetHandleId(unit);
        throw new Error("Method not implemented.");
    }
}