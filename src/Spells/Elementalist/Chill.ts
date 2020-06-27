import { Unit, Timer, MapPlayer, Effect } from "w3ts/index";
import { Buffs, Dummies, Models } from "Config";
import { SpellHelper } from "Global/SpellHelper";

export class Chill {
    
    private static _instance: Record<number, Chill> = {};

    public static readonly MaxStacks = 5;
    public static readonly StackDuration = 2.5;
    public static readonly FrozenBuffId = Buffs.Frozen;
    public static readonly FrozenSpellId = Dummies.Frozen;
    public static readonly FrozenOrderId = "thunderbolt";
    public static readonly ChilledBuffId = Buffs.Chilled;
    public static readonly ChillSpellId = Dummies.Chilled;
    public static readonly ChillOrderId = "cripple";

    public static readonly NeutralPlayer = Player(PLAYER_NEUTRAL_PASSIVE);

    private timer = new Timer();
    private stacks: number = 0;
    constructor(
        private unit: Unit,
    ) {
        
    }

    private Apply(stacks: number) {

        print("Applying stack: ", this.stacks, stacks);
        if (this.stacks >= 5) {
            return;
        }

        // Reapply or apply the slow
        this.stacks += stacks;
        print(this.stacks);
        
        // If stacks are 5, freeze the unit
        this.unit.removeAbility(Chill.ChilledBuffId);
        if (this.stacks >= 5) {
            SpellHelper.DummyCastTarget(Chill.NeutralPlayer, this.unit.x, this.unit.y, this.unit.handle, Chill.FrozenSpellId, 1, Chill.FrozenOrderId);
        } else if (this.stacks > 0) {
            SpellHelper.DummyCastTarget(Chill.NeutralPlayer, this.unit.x, this.unit.y, this.unit.handle, Chill.ChillSpellId, this.stacks, Chill.ChillOrderId);
        }
    }

    private Remove(stacks: number) {

        // print("Removing stack: ", this.stacks, stacks);
        if (this.stacks <= 0) return;

        // Reapply or apply the slow
        this.stacks -= stacks;

        if (this.stacks >= 5) return;
        // print("higher than 5");

        this.unit.removeAbility(Chill.ChilledBuffId);
        this.unit.removeAbility(Chill.FrozenBuffId);
        if (this.stacks > 0) {
            // print("casting chill");
            SpellHelper.DummyCastTarget(Chill.NeutralPlayer, this.unit.x, this.unit.y, this.unit.handle, Chill.ChillSpellId, this.stacks, Chill.ChillOrderId);
        }
    }

    private Destroy() {
        this.timer.destroy();
        this.unit.removeAbility(Chill.ChilledBuffId);
        this.unit.removeAbility(Chill.FrozenBuffId);
    }

    public static Apply(target: Unit, stacks: number) {

        let id = target.id;
        let instance = this._instance[id] || new Chill(target);

        instance.Apply(stacks);

        // Refresh the timer
        instance.timer.pause();
        instance.timer.start(Chill.StackDuration, true, () => {
            instance.Remove(1);
            if (instance.stacks <= 0) {
                instance.Destroy();
                delete this._instance[id];
            }
        });
        this._instance[id] = instance;
    }

    public static ApplyToMax(target: Unit, stacks: number, max: number) {

        let id = target.id;
        let instance = this._instance[id] || new Chill(target);

        if (stacks > max) return;
        if (instance.stacks + stacks > max) stacks = max - math.floor(instance.stacks);
        instance.Apply(stacks);

        // Refresh the timer
        instance.timer.pause();
        instance.timer.start(Chill.StackDuration, true, () => {
            instance.Remove(1);
            if (instance.stacks <= 0) {
                instance.Destroy();
                delete this._instance[id];
            }
        });
        this._instance[id] = instance;
    }

    public static Remove(target: Unit, stacks: number = this.MaxStacks) {

        let id = target.id;
        let instance = this._instance[id] || new Chill(target);

        instance.Remove(stacks);

        this._instance[id] = instance;
    }

    public static IsFrozen(target: Unit) {
        // let instance = this._instance[target.id];
        // return (!instance || instance.stacks == 5);
        return target.getAbilityLevel(this.FrozenBuffId) > 0;
    }
}