import { EssenceType } from "./EssenceType";
import { Unit, Item } from "w3ts/index";
import { Items, Spells, Log, Buffs } from "Config";

export class ElementalistMastery {

    private static _instance: Record<number, ElementalistMastery> = {};
    public static readonly Item: Record<EssenceType, number> = {
        [EssenceType.Fire]: Items.FireMastery,
        [EssenceType.Frost]: Items.FrostMastery,
        [EssenceType.Lightning]: Items.LightningMastery,
    }

    private static readonly OrbsPerLevel: Record<number, number> = {
        1: 18,
        2: 19,
        3: 21,
        4: 23,
        5: 26,
        6: 28,
        7: 0
    }

    private _level: Record<EssenceType, number> = {
        [EssenceType.Fire]: 0,
        [EssenceType.Frost]: 0,
        [EssenceType.Lightning]: 0,
    }

    private bonusExp: number = 0;
    constructor(
        private unit: Unit,
    ) { }

    public get fire() {
        return this._level[EssenceType.Fire];
    }
    public get frost() {
        return this._level[EssenceType.Frost];
    }
    public get lightning() {
        return this._level[EssenceType.Lightning];
    }
    // public set fire(value: number) {
    //     this.SetLevel(EssenceType.Fire, value);
    // }
    // public set frost(value: number) {
    //     this.SetLevel(EssenceType.Frost, value);
    // }
    // public set lightning(value: number) {
    //     this.SetLevel(EssenceType.Lightning, value);
    // }

    private SetLevel(type: EssenceType, level: number, item: Item) {
        this._level[type] = level;
       
        let typeName = "";
        switch (type) {
            case EssenceType.Fire:
                typeName = "|cffffcc00Fire|r";
                this.unit.setAbilityLevel(Spells.Fireball, level);
                this.unit.setAbilityLevel(Spells.FlameBarrage, level);
                this.unit.setAbilityLevel(Spells.Inferno, level);
                break;
            case EssenceType.Frost:
                typeName = "|cff8a99ffFrost|r";
                this.unit.setAbilityLevel(Spells.IceBlast, level);
                this.unit.setAbilityLevel(Spells.RayOfCold, level);
                this.unit.setAbilityLevel(Spells.FrostNova, level);
                break;
            case EssenceType.Lightning:
                typeName = "|cffff00ffLightning|r";
                this.unit.setAbilityLevel(Spells.Conductivity, level);
                this.unit.setAbilityLevel(Spells.LivingCurrent, level);
                this.unit.setAbilityLevel(Spells.IonicConversion, level);
                break;
        }
        BlzSetItemExtendedTooltip(item.handle, `Level of your ${typeName} spells is |cffffd9b3${level}|r.\n\nSpend ${item.charges} more orbs to increase level.`);
    }
    
    public AddExperience(type: EssenceType, amount: number) {
        let index = GetInventoryIndexOfItemTypeBJ(this.unit.handle, ElementalistMastery.Item[type]);
        if (index == -1) return false;

        let it = Item.fromHandle(this.unit.getItemInSlot(index-1));

        Log.info("bonus exp", this.bonusExp);
        if (this.bonusExp > 0) {
            amount += this.bonusExp;
            this.bonusExp = 0;
        }
        this.Upgrade(type, amount, it);
    }

    public AddBonusExperience(amount: number) {
        this.bonusExp = amount;
    }

    private Upgrade(type: EssenceType, amount: number, item: Item) {

        let max = item.charges;
        let newLevel = this._level[type] + 1;
        let orbs = ElementalistMastery.OrbsPerLevel[newLevel];
        // print(newLevel, orbs);
        // If it steps over, upgrade the item and call again with rest
        if (amount < max) {
            // print("less than max", max, amount);
            item.charges = max - amount;
            return;
        } else if (orbs) {
            // print("more than max", max, amount);
            let after = amount - max;
            item.charges = orbs;
            this.Upgrade(type, after, item);
            this.SetLevel(type, newLevel, item);
            return;
        } else {
            // print("max", max, amount);
            item.charges = 0;
            // this.SetLevel(type, newLevel, item);
        }
        return;
    }

    static Consume(caster: Unit) {
        if (caster.getAbilityLevel(Buffs.ElementalMastery) > 0) {
            caster.removeAbility(Buffs.ElementalMastery)
            return true;
        }
        return false;
    }

    public Destroy() {

    }

    public static Get(unit: Unit) {
        return this._instance[unit.id];
    }

    public static GetLevel(type: EssenceType, unit: Unit): number {
        
        let index = GetInventoryIndexOfItemTypeBJ(unit.handle, this.Item[type]);
        if (index == -1) return 1;

        let it = Item.fromHandle(unit.getItemInSlot(index));
        let name = it.name;
        return Number(name.slice(name.length, 1));
    }

    public static Register(unit: Unit) {

        unit.addItemToSlotById(this.Item[EssenceType.Fire], 1);
        unit.addItemToSlotById(this.Item[EssenceType.Frost], 3);
        unit.addItemToSlotById(this.Item[EssenceType.Lightning], 5);

        let id = unit.id;
        let instance = new ElementalistMastery(unit);
        if (id in this._instance) this._instance[id].Destroy();
        this._instance[id] = instance;
        instance.AddExperience(EssenceType.Fire, 1);
        instance.AddExperience(EssenceType.Frost, 1);
        instance.AddExperience(EssenceType.Lightning, 1);
        return instance;
    }
}