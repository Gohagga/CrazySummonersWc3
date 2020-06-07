import { Talent, TalentData } from "Global/TalentTree/Talent";
import { TalentTreeView } from "./TalentTreeView";

export type TalentGenerator = (rank: number) => TalentData;

export class TalentTree {
    static readonly Id: number = 0;

    public readonly unit: unit;
    public title: string = "Talent tree";
    public pointsAvailable: number = 0;
    private talents: Talent[] = [];
    private rankState: number[] = [];
    private tempRankState?: number[];
        
    constructor(unit: unit, load?: string) {
        this.unit = unit;
    }

    public CheckDependencies(state: number[], index: number, player: player): [ boolean, string ] {
        
        const talent = this.talents[index];
        if (!talent || !talent.dependency) return [ true, "" ];

        const dep = talent.dependency;
        const toHide = [];
        const toShow = [];
        let ok = true;
        let error = "";

        let link;
        let depTalent;
        if (dep.left) {

            depTalent = this.talents[index - 1];
            link = TalentTreeView.frames.horizontalLink[index - 1];
            toShow.push(link);
            if (depTalent && state[index - 1] && state[index - 1] < dep.left) {
                ok = false;
                error += depTalent.name+" "+dep.left;
                toHide.push(link);
            }
        }
        if (dep.up) {

            depTalent = this.talents[index + TalentTreeView.Columns];
            link = TalentTreeView.frames.verticalLink[index];
            toShow.push(link);
            if (depTalent && state[index + TalentTreeView.Columns] && state[index + TalentTreeView.Columns] < dep.up) {
                ok = false;
                error += depTalent.name+" "+dep.up;
                toHide.push(link);
            }
        }
        if (dep.right) {

            depTalent = this.talents[index + 1];
            link = TalentTreeView.frames.horizontalLink[index];
            toShow.push(link);
            if (depTalent && state[index + 1] && state[index + 1] < dep.right) {
                ok = false;
                error += depTalent.name+" "+dep.right;
                toHide.push(link);
            }
        }
        if (dep.down) {

            depTalent = this.talents[index - TalentTreeView.Columns];
            link = TalentTreeView.frames.verticalLink[index - TalentTreeView.Columns];
            toShow.push(link);
            if (depTalent && state[index - TalentTreeView.Columns] && state[index - TalentTreeView.Columns] < dep.down) {
                ok = false;
                error += depTalent.name+" "+dep.down;
                toHide.push(link);
            }
        }

        toShow.forEach(link => {
            BlzFrameSetTexture(link, TalentTreeView.ActiveLinkTexture, 0, true)
            BlzFrameSetVisible(link, true)
        });
        toHide.forEach(link => {
            BlzFrameSetTexture(link, TalentTreeView.InactiveLinkTexture, 0, true)
        });
        return [ ok, error ];
    }

    public GetTalent(i: number) {
        return this.talents[i];
    }

    /**
     * Creates a talent and saves it at the specified x/y position within the tree.
     * If data is passed, new talent will be initialized with it.
     */
    public AddTalent(x: number, y: number, data?: TalentData) {
        // if (x >= TalentTreeView.Columns || y >= TalentTreeView.Rows) {
        //     x = TalentTreeView.Columns - 1;
        //     y = TalentTreeView.Rows - 1;
        // }

        let position = x + y * TalentTreeView.Columns;
        let talent = new Talent(data);
        if (this.talents[position]) {
            let existing = this.talents[position];
            existing.NextRank(talent);
        } else {
            this.talents[position] = talent;
            this.rankState[position] = 0;
        }
        return talent;
    }

    public AddMultiRankTalent(x: number, y: number, maxRanks: number, generator: TalentGenerator): void {

        let t = this.AddTalent(x, y, generator(1));
        if (maxRanks <= 1) return;
        
        for (let i = 2; i < maxRanks+1; i++) {
            let data = generator(i);
            t = t.NextRank(new Talent(data));
        }
        const data = generator(maxRanks);
        t.FinalDescription(data);
    }

    public ApplyTalentTemporary(i: number) {

        const talent = this.talents[i];
        if (!this.tempRankState) this.tempRankState = [];

        if (this.tempRankState[i] < talent.maxRank) {
            this.pointsAvailable -= 1;
            this.tempRankState[i]++;

            if (talent.nextRank) {
                this.talents[i] = talent.nextRank;
            }
        }
    }

    public GetRankState() {
        return this.rankState;
    }

    public ResetTempRankState() {

        if (!this.tempRankState) return;
        for (let i = 0; i < TalentTreeView.MaxTalents; i++) {
            let talent = this.talents[i];
            if (talent && this.rankState[i] != this.tempRankState[i]) {

                for (let j = this.tempRankState[i]; j < this.rankState[i]; j--) {
                    if (talent.prevRank) {
                        talent = talent.prevRank;
                        this.pointsAvailable += 1;
                    }
                }
            }
        }

        this.tempRankState = undefined;
    }

    public SaveTalentRankState() {
        if (!this.tempRankState) return;
        for (let i = 0; i < TalentTreeView.MaxTalents; i++) {
            const t = this.talents[i];
            const state = this.rankState[i];
            const tempState = this.tempRankState[i];

            if (t) {
                if (state && state != tempState) {

                    t.ActivateRecursive(this.unit, tempState - state);
                    this.rankState[i] = tempState;
                } else {

                }
            }
        }
        this.ResetTempRankState();
    }

    public GetTempRankState(): number[] {
        if (!this.tempRankState) {
            this.tempRankState = [];
            for (let i = 0; i < TalentTreeView.MaxTalents; i++) {
                this.tempRankState[i] = this.rankState[i];
            }
        }
        return this.tempRankState;
    }

    public Serialize() {
        // Assign all talents an ID based on index in the talents[]
    }

    private loadFromSerializedData(data: string) {

    }
}