import { Unit } from "w3ts/index";

export class Chill {
    
    private static _instance: Record<number, Chill> = {};

    constructor(
        private unit: Unit,
        private stacks: number,
    ) {
        
    }

    public static Apply(target: Unit, stacks: number) {

    }

    public static IsFrozen(target: Unit) {

    }
}