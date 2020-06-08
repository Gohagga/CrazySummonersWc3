import { IRequirement } from "./IRequirement";

export class UnitRequirement implements IRequirement {
    
    private unitTypes: number[];

    private instances: Record<number, UnitReqInstance> = {};
    private _subscriptions: ((player: player) => void)[] = [];

    constructor(unitTypes: number[]) {
        this.unitTypes = [];

        for (let i = 0; i < unitTypes.length; i++) {
            this.unitTypes[i + 1] = unitTypes[i];
        }
    }

    Subscribe(callback: (player: player) => void): void {
        this._subscriptions.push(callback);
    }

    Get(player: player): number {
        let ret = this.instances[GetPlayerId(player)];
        if (!ret) return 0
        return ret.level || 0;
    }

    Increase(player: player, amount: number = 1): number {
        
        const playerId = GetPlayerId(player);
        const instance: UnitReqInstance = this.instances[playerId] || {
            level: 0,
            unit: []
        };
        const targetLvl = instance.level + amount;
        if (targetLvl < instance.level) return 0;
        for (let i = instance.level + 1; i <= targetLvl; i++) {
            // print("Creating unit:", GetObjectName(this.unitTypes[i]));
            // instance.unit[i] = CreateUnit(player, this.unitTypes[i], 0, 0, 0);
            instance.level++;
        }
        this.instances[playerId] = instance;
        this.RunSubscriptions(player);
    }

    Decrease(player: player, amount: number = 1): number {
        
        const playerId = GetPlayerId(player);
        const instance: UnitReqInstance = this.instances[playerId] || {
            level: 0,
            unit: []
        };
        const targetLvl = instance.level - amount;

        if (targetLvl > instance.level) return 0;

        for (let i = instance.level; i > targetLvl; i--) {
            // RemoveUnit(instance.unit[i]);
            instance.level--;
        }
        this.instances[playerId] = instance;
        this.RunSubscriptions(player);
    }

    Set(player: player, amount: number): boolean {

        const id = GetHandleId(player);
        throw new Error("Method not implemented.");
    }

    RunSubscriptions(player: player) {
        for (let sub of this._subscriptions) {
            sub(player);
        }
    }
}

export interface UnitReqInstance {
    level: number,
    unit: unit[]
}