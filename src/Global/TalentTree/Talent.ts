import { TalentTree } from "./TalentTree";

export type OnTalentStateChange = (unit: unit) => void;
export type RequirementsCheck = (tree: TalentTree, unit: unit) => [ boolean, string ];
export type TalentDependency = {
    left?: number;
    up?: number;
    right?: number;
    down?: number;
}

export type TalentData = {
    Name?: string;
    Description?: string;
    Icon?: string;
    IconDisabled?: string;
    OnActivate?: OnTalentStateChange;
    OnDeactivate?: OnTalentStateChange;
    Dependency?: TalentDependency;
    Requirements?: RequirementsCheck;
}

export class Talent {
    public name: string = "";
    public description: string = "";
    public icon: string = "";
    public iconDisabled: string = "";
    public onActivate: OnTalentStateChange = () => null;
    public onDeactivate: OnTalentStateChange = () => null;
    public dependency?: TalentDependency;
    public nextRank?: Talent;
    public prevRank?: Talent;
    public requirements?: RequirementsCheck;
    public maxRank: number = 1;
    public isLink: boolean = false;

    constructor(data?: TalentData) {
        if (data && data.Name)              this.Name(data.Name);
        if (data && data.Description)       this.Description(data.Description);
        if (data && data.Icon)              this.Icon(data.Icon);
        if (data && data.IconDisabled)      this.IconDisabled(data.IconDisabled);
        if (data && data.OnActivate)        this.OnActivate(data.OnActivate);
        if (data && data.OnDeactivate)      this.OnDeactivate(data.OnDeactivate);

        if (data && data.Requirements)      this.SetRequirements(data.Requirements);
        if (data && data.Dependency)        this.Dependency(data.Dependency);
    }

    /**
     * Sets or returns talent property.
     */
    public Name(newValue?: string) {
        if (newValue == undefined) { return this.name; }
        this.name = newValue;
        return this;
    }

    /**
     * Sets or returns talent property.
     */
    public Description(newValue?: string) {
        if (!newValue) { return this.description; }
        this.description = newValue;
        return this;
    }

    /**
     * Sets or returns talent property.
     */
    public Icon(newValue?: string) {
        if (newValue) {
            this.icon = newValue;
            [this.iconDisabled] = string.gsub(newValue, "CommandButtons\\", "CommandButtonsDisabled\\DIS");
        }
        return this.icon;
    }

    /**
     * Sets or returns talent property.
     */
    public IconDisabled(newValue?: string) {
        if (newValue == undefined) { return this.iconDisabled; }
        this.iconDisabled = newValue;
        return this;
    }

    /**
     * Sets or returns talent property.
     */
    public OnActivate(callback?: OnTalentStateChange) {
        if (callback == undefined) { return this.onActivate; }
        this.onActivate = callback;
        return this;
    }

    /**
     * Sets or returns talent property.
     */
    public OnDeactivate(callback?: OnTalentStateChange) {
        if (callback == undefined) { return this.onDeactivate; }
        this.onDeactivate = callback;
        return this;
    }

    /**
     * Sets or returns talent property.
     */
    public Dependency(newValue?: TalentDependency) {
        if (newValue != undefined) {
            if (!this.dependency) this.dependency = {};
            if (newValue.left) this.dependency.left = newValue.left;
            if (newValue.up) this.dependency.up = newValue.up;
            if (newValue.right) this.dependency.right = newValue.right;
            if (newValue.down) this.dependency.down = newValue.down;
            return this;
        }
        return this.dependency;
    }

    public SetRequirements(newValue: RequirementsCheck) {
        this.requirements = newValue;
    }

    public Requirements(tree: TalentTree, unit: unit): [ boolean, string ] {
        if (this.requirements)
            return this.requirements(tree, unit);
        return [ true, "" ];
    }

    public NextRank(nextRank?: Talent) {
        if (nextRank != undefined) {

            this.nextRank = nextRank;
            this.nextRank.prevRank = this;
            nextRank.MaxRank(this.maxRank + 1);
            // If this is the middle talent, we need to show current and next talent description
            // this.description = this.description+"\n\nNext rank:\n"+nextRank.description;
            return this.nextRank;
        }
        return this;
    }

    public FinalDescription(data?: TalentData): Talent {
        const t = new Talent();
        if (data) {
            if (data && data.Name)              t.Name(data.Name);
            if (data && data.Description)       t.Description(data.Description);
            if (data && data.Icon)              t.Icon(data.Icon);
            if (data && data.IconDisabled)      t.IconDisabled(data.IconDisabled);
        }
        this.nextRank = t;
        t.prevRank = this;
        t.maxRank = this.maxRank;
        t.dependency = Object.assign({}, this.dependency);
        return t;
    }

    public MaxRank(newValue?: number) {
        if (newValue == undefined) return this.maxRank;
        this.maxRank = newValue
        if (this.prevRank)
            this.prevRank.MaxRank(newValue);
        return this;
    }

    public ActivateRecursive(unit: unit, count: number) {
        if (this.prevRank && count > 0) {
            this.prevRank.ActivateRecursive(unit, count - 1);
        }
        this.onActivate(unit);
    }
}