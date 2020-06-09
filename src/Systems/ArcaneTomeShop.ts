import { ResourceBar } from "./OrbResource/ResourceBar";
import { OrbType } from "./OrbResource/OrbType";
import { Items } from "Config";

export class ArcaneTomeShop {

    static init() {
        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_PICKUP_ITEM);
        TriggerAddAction(t, () => {
            let bar = ResourceBar.Get(GetOwningPlayer(GetTriggerUnit()));
            let type = {
                [Items.GemWhite]: OrbType.White,
                [Items.GemBlue]: OrbType.Blue,
                [Items.GemRed]: OrbType.Red,
                [Items.GemPurple]: OrbType.Purple,
                [Items.GemSummoning]: OrbType.Summoning
            }[GetItemTypeId(GetManipulatedItem())];

            let result = true;
            if (type == OrbType.White) {
                result = bar.AddOrb(type);
            } else if (type == OrbType.Blue) {
                result = bar.AddOrb(type);
            } else if (type == OrbType.Red) {
                result = bar.AddOrb(type);
            } else if (type == OrbType.Purple) {
                result = bar.AddOrb(type);
            } else if (type == OrbType.Summoning) {
                result = bar.AddOrb(type);
            }
            if (result == false) {
                let owner = GetOwningPlayer(GetTriggerUnit());
                SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
            }
        });
    }
}