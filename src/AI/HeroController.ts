import { Unit, Timer } from "w3ts/index";
import { SpawnPoint } from "Spells/Spawn";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { Log } from "Config";

export abstract class HeroController {

    // Instance of a main coroutine for a unit
    private static _instance: Record<number, LuaThread> = {};
    private static Interval: number = 0.6;

    // Main
    abstract Main(unit: Unit): void;

    protected unit: Unit;
    protected resourceBar: ResourceBar;
    protected interval = HeroController.Interval;
    private timer = new Timer();

    constructor(unit: unit, 
        protected crystals: Unit[],
        protected shop: Unit
    ) {
        this.unit = Unit.fromHandle(unit);
        this.resourceBar = ResourceBar.Get(this.unit.owner.handle);
        this.crystals = crystals;
    }

    public Start() {

        this.unit.removeGuardPosition();
        const unitId = this.unit.id;
        let c = coroutine.create((unit: Unit) => this.Main(unit));
        coroutine.resume(c, this.unit);
        HeroController._instance[unitId] = c;

        this.Execute();
    }

    public Execute() {
        this.timer.start(this.interval, false, () => {
            coroutine.resume(HeroController._instance[this.unit.id], this.unit);
            this.Execute();
        });
    }

    public WaitForUnitLevel(level: number) {
        while (this.unit.level < level) {
            coroutine.yield();
        }
    }

    public UntilLevel(level: number, actions: () => void) {
        while (this.unit.level < level) {
            actions();
            coroutine.yield();
        }
    }

    // public While(condition: boolean, actions: () => void) {
    //     Log.info("inside while", condition);
    //     while (condition) {
    //         Log.info("perform action");
    //         actions();
    //         Log.info("yield");
    //         coroutine.yield();
    //     }
    // }

    public Repeat(actions: () => boolean) {
        while (actions()) {
            coroutine.yield();
        }
    }

    static init() {

        // let t = CreateTrigger();
        // TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_LEVEL);
        // TriggerAddAction(t, () => {

        //     let unit = GetTriggerUnit();
        //     let unitId = GetHandleId(unit);
        //     if (HeroProgression._instance[unitId]) {
        //         coroutine.resume(HeroProgression._instance[unitId], unit);
        //     }
        // });
    }

    // Select a skill ->
    //  input = enemy heroes + self
    //  output = value, action

    // Do action ->
    //  input = board, self orbs, 
}