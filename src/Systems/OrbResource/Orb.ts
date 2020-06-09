import { OrbView } from "./OrbView";
import { Textures, Upgrades } from "Config";
import { BlueOrbReq, WhiteOrbReq, RedOrbReq, PurpleOrbReq, SummonOrbReq } from "Modules/Globals";
import { IRequirement } from "Systems/Requirement/IRequirement";
import { OrbType } from "./OrbType";
export { OrbType } from './OrbType';

export class Orb {
    public type: OrbType;
    public cooldownRemaining = 0;
    public isAvailable = true;
    public enabledTexture = "";
    public disabledTexture = "";
    public requirement: IRequirement;
    public tooltip = "";
    public defaultCooldown = 10;

    public static get Config() {
        return {
            icon: [
                Textures.BallBlue,
                Textures.BallWhite,
                Textures.BallRed,
                Textures.BallPurple,
                Textures.BallSummoning,
                ""
            ],
            disabled: [
                Textures.DisBallBlue,
                Textures.DisBallWhite,
                Textures.DisBallRed,
                Textures.DisBallPurple,
                Textures.DisBallSummoning,
                ""
            ],
            upgrade: [
                BlueOrbReq,
                WhiteOrbReq,
                RedOrbReq,
                PurpleOrbReq,
                SummonOrbReq,
                
                // Upgrades.BlueOrbs,
                // Upgrades.WhiteOrbs,
                // Upgrades.RedOrbs,
                // Upgrades.PurpleOrbs,
                // Upgrades.SummoningOrbs,
                // Upgrades.AnyOrbs
            ],
            tooltip: [
                "Blue Orb",
                "White Orb",
                "Red Orb",
                "Purple Orb",
                "Summoning Orb",
                ""
            ],
            cooldown: [
                40,
                40,
                40,
                40,
                20
            ]
        };
    };
    private timer = CreateTimer();
    private index: number;

    constructor(type: OrbType, index: number) {
        this.type = type;
        let typeId = <number>type;
        this.enabledTexture = Orb.Config.icon[typeId];
        this.disabledTexture = Orb.Config.disabled[typeId];
        this.requirement = Orb.Config.upgrade[typeId];
        this.tooltip = Orb.Config.tooltip[typeId];
        this.defaultCooldown = Orb.Config.cooldown[typeId];
        this.index = index;

        // TODO: SWITCH THIS OUT AND CHECK FOR INDEX SWITCHING
        let orbView = OrbView.Orbs[this.index];
        orbView.tooltipText.SetText(this.tooltip);
    }

    public Destroy() {
        PauseTimer(this.timer);
        DestroyTimer(this.timer);
    }

    public Update(player: player) {
        let orbView = OrbView.Orbs[this.index];
        if (GetLocalPlayer() == player) {

            orbView.mainButton.SetVisible(true);
            orbView.background.SetVisible(true);

            if (this.isAvailable) {
                orbView.mainImage.SetTexture(this.enabledTexture);
                orbView.cooldownCounter.SetVisible(false);
            } else {
                orbView.mainImage.SetTexture(this.disabledTexture);
                orbView.cooldownCounter.SetVisible(true);
                orbView.cooldownCounter.SetText(string.format("%.1f", this.cooldownRemaining));
            }
        }
    }

    public Consume(player: player, seconds: number = this.defaultCooldown) {
        this.isAvailable = false;
        this.cooldownRemaining = seconds;
        this.requirement.Decrease(player);
        TimerStart(this.timer, 0.1, true, () => {
            this.cooldownRemaining -= 0.1;
            if (this.cooldownRemaining <= 0 || this.isAvailable == true) {
                this.isAvailable = true;
                this.requirement.Increase(player);
                PauseTimer(this.timer);
            }
            this.Update(player);
        });
    }
}

export function OrbCostToString(cost: OrbType[]) {
    let retVal = "Cost [";
    let letter: Record<OrbType, string> = {
        [OrbType.Red]: '|cffff3333R|r',
        [OrbType.White]: 'W',
        [OrbType.Purple]: '|cffff77ffP|r',
        [OrbType.Blue]: '|cff0080ffB|r',
        [OrbType.Summoning]: '|cffffd9b3S|r',
        [OrbType.Any]: ''
    }
    let first = true;
    for (let o of cost) {
        if (letter[o] != '') {
            if (first) {
                first = false;
            } else {
                retVal += ' + ';
            }
            retVal += letter[o];
        }
    }
    retVal += ']';
    return retVal;
}