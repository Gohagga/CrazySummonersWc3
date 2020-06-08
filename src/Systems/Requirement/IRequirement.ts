export interface IRequirement {
    
    Get(unit: unit): number;

    Increase(unit: unit, amount: number): number;

    Decrease(unit: unit, amount: number): number;

    Set(unit: unit, amount: number): boolean;
}