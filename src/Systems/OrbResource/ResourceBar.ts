import { Orb } from "./Orb";
import { OrbView } from "./OrbView";
import { OrbType } from "./OrbType";

export class ResourceBar {
    private static _instance: Record<number, ResourceBar> = {};
    private orbs: Orb[] = [];
    private topRowCount = 0;
    private player: player;
    private bypass = false;

    constructor(player: player) {
        this.player = player;
    }
    
    public static Register(rb: ResourceBar) {
        const playerId = GetPlayerId(rb.player);
        ResourceBar._instance[playerId] = rb;
        if (GetLocalPlayer() == rb.player) {
            OrbView.Box.SetVisible(true);
        }
    }

    public static ResetUpgrades(player: player) {

        let rb = this._instance[GetPlayerId(player)];
        if (!rb) return;
        for (let req of Orb.Config.upgrade) {
            req.Decrease(player, req.Get(player));
        }
        if (player == GetLocalPlayer()) {
            for (let ov of OrbView.Orbs) {
                ov.mainButton.SetVisible(false);
            }
        }
        for (let o of rb.orbs) {
            o.Destroy();
        }
        rb.orbs = [];
    }

    public get Orbs() {
        return this.orbs;
    }

    public AddOrb(type: OrbType) {
        let viewId = this.orbs.length;
        if (viewId > 17) return;

        if (type == OrbType.Summoning) {
            viewId = 12 + this.topRowCount;
            if (viewId > 17) return;
            this.topRowCount++;
        } else {
            viewId = this.orbs.length - this.topRowCount;
            if (viewId > 11) return;
        }

        let orb = new Orb(type, viewId);
        let index = this.orbs.push(orb);

        orb.Update(this.player);
        orb.requirement.Increase(this.player);
    }
    
    public get GetPlayer() {
        return this.player;
    }

    public static Get(player: player) {
        return this._instance[GetPlayerId(player)];
    }

    public ForceCast(costlessActions: () => void) {
        this.bypass = true;
        costlessActions();
        this.bypass = false;
    }

    public Consume(cost: OrbType[] = []) {
        if (this.bypass) return true;
        let usedTypes: { type: number, available: boolean }[] = [];
        for (let i = 0; i < this.orbs.length; i++) {
            usedTypes[i] = {
                type: this.orbs[i].type,
                available: this.orbs[i].isAvailable
            };
        }
        let usedIndices = [];
        for (let i = 0; i < cost.length; i++) {
            // print("i", i);
            let hasMat = false;
            // print("Checking for "+<OrbType>cost[i], usedTypes.length);
            for (let j = 0; j < usedTypes.length; j++) {
                // print(j, "?")
                let consume = false;
                if (usedTypes[j].available &&
                    cost[i] == usedTypes[j].type) {
                    // print("Found index", j);
                    usedTypes[j].available = false;
                    hasMat = true;
                    usedIndices.push(j+1);
                    break;
                }
            }
            if (hasMat == false) {
                return false;
            }
        }
        
        for (let index of usedIndices) {
            this.orbs[index].Consume(this.player, 20);
        }
        return true;
    }

    static init() {
    }
}