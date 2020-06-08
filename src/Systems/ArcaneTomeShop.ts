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

            if (type == OrbType.White) {
                bar.AddOrb(type);
            } else if (type == OrbType.Blue) {
                bar.AddOrb(type);
            } else if (type == OrbType.Red) {
                bar.AddOrb(type);
            } else if (type == OrbType.Purple) {
                bar.AddOrb(type);
            } else if (type == OrbType.Summoning) {
                bar.AddOrb(type);
            }
        });
    }
}