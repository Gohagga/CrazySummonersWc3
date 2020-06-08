import { IRequirement } from "./IRequirement";
import { OrbType } from "Systems/OrbResource/OrbType";

export interface Upgrade {
    id: number,
    checks: { reqType: RequirementType, level: number }[];
}

export enum RequirementType {
    Blue,
    Purple,
    Red,
    White,
    Summoning,
    Mastery
}

export class RequirementTracker {

    private _reqTypes: RequirementType[] = [];
    private _requirements: Record<OrbType, IRequirement>;
    private _upgrades: Record<number, Upgrade> = {};
    private _subscriptions: Record<RequirementType, Upgrade[]> = {
        [RequirementType.Blue]: [],
        [RequirementType.Purple]: [],
        [RequirementType.Red]: [],
        [RequirementType.White]: [],
        [RequirementType.Summoning]: [],
        [RequirementType.Mastery]: [],
    }

    constructor(requirements: Record<RequirementType, IRequirement>) {
        this._requirements = requirements;

        this._reqTypes = [];
        let keys = Object.keys(requirements) as unknown as RequirementType[];
        for (let k of keys) {
            
            this._reqTypes.push(k);
            let orbType = k;
            requirements[k].Subscribe((player: player) => {

                if (orbType in this._subscriptions == false) return;
                // CHECK FOR STUFF HERE
                for (let checks of this._subscriptions[orbType]) {
                    this.Resolve(player, checks);
                }
            })
        }
    }

    Register(upgradeId: number, cost: RequirementType[]) {

        // Sum up all the costs per type
        let costs: Record<number, number> = {};
        for (let i = 0; i < cost.length; i++) {
            let orbType = cost[i];
            let current = costs[orbType] || 0;
            costs[orbType] = current + 1;
        }
        // Create an upgrade object
        const upgrade: Upgrade = {
            id: upgradeId,
            checks: []
        };
        for (let type of this._reqTypes) {
            if (costs[type] && costs[type] > 0) {
                // Create the check
                upgrade.checks.push({
                    level: costs[type],
                    reqType: type
                });
            }
        }

        // Register the upgrade object to all the type changes
        for (let check of upgrade.checks) {
            let subs = this._subscriptions[check.reqType] || [];
            subs.push(upgrade);
            this._subscriptions[check.reqType] = subs;
        }
    }

    Resolve(player: player, upgrade: Upgrade): boolean {

        // Check if any of the levels is below the required
        for (let check of upgrade.checks) {
            // print("orb type", check.reqType, check.level)
            if (check.reqType in this._requirements) {
                // print("checking requirement")
                let req = this._requirements[check.reqType];
                // print(req.Get(player), check.level);
                if (req.Get(player) < check.level) {
                    BlzDecPlayerTechResearched(player, upgrade.id, GetPlayerTechCountSimple(upgrade.id, player));
                    return false;
                }
            }
        }

        // It hasn't returned, it means the requirements are fulfilled
        AddPlayerTechResearched(player, upgrade.id, 1);
    }
}