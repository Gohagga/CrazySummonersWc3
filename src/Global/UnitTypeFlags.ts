import { SpawnedUnitTypes } from "Config";

export class UnitTypeFlags {
    public static Undead: Record<number, boolean> = {};
    public static Demon: Record<number, boolean> = {};
    public static Human: Record<number, boolean> = {};
    public static Elemental: Record<number, boolean> = {};
    public static Horror: Record<number, boolean> = {};

    public static IsUnitUndead(unit: unit) {
        return UnitTypeFlags.Undead[GetUnitTypeId(unit)] || false;
    }
    public static IsUnitDemon(unit: unit) {
        return UnitTypeFlags.Demon[GetUnitTypeId(unit)] || false;
    }
    public static IsUnitHuman(unit: unit) {
        return UnitTypeFlags.Human[GetUnitTypeId(unit)] || false;
    }
    public static IsUnitHorror(unit: unit) {
        return UnitTypeFlags.Horror[GetUnitTypeId(unit)] || false;
    }
    public static IsUnitElemental(unit: unit) {
        return UnitTypeFlags.Elemental[GetUnitTypeId(unit)] || false;
    }
    
    static init() {
    
        for (let id of SpawnedUnitTypes.Undead) {
            UnitTypeFlags.Undead[id] = true;
        }
    
        for (let id of SpawnedUnitTypes.Demon) {
            UnitTypeFlags.Demon[id] = true;
        }
    
        for (let id of SpawnedUnitTypes.Horror) {
            UnitTypeFlags.Horror[id] = true;
        }
    
        for (let id of SpawnedUnitTypes.Human) {
            UnitTypeFlags.Human[id] = true;
        }
    
    }
}