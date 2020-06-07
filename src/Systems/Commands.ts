import { SpellGroup } from "Global/SpellHelper";

export class Commands {

    static init() {
        let t = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t, Player(0), "+1", true);
        TriggerAddAction(t, () => {
            GroupEnumUnitsSelected(SpellGroup, Player(0), null);
            let u = FirstOfGroup(SpellGroup);
            SetHeroLevel(u, GetHeroLevel(u) + 1, true);
        });

        t = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t, Player(0), "+20", true);
        TriggerAddAction(t, () => {
            GroupEnumUnitsSelected(SpellGroup, Player(0), null);
            let u = FirstOfGroup(SpellGroup);
            SetHeroLevel(u, 20, true);
        });

        t = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t, Player(0), "-kill", true);
        TriggerAddAction(t, () => {
            GroupEnumUnitsSelected(SpellGroup, Player(0), null);
            let u = FirstOfGroup(SpellGroup);
            while (u != null) {
                GroupRemoveUnit(SpellGroup, u);
                KillUnit(u);
                u = FirstOfGroup(SpellGroup);
            }
        });
    }
}