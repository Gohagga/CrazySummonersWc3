import { SpellGroup } from "Global/SpellHelper";
import { GamePlayer } from "./GamePlayer";
import { Units } from "Config";
import { MapPlayer } from "w3ts/index";
import { BlueCrystal } from "Modules/Globals";
import { PaladinController } from "AI/Paladin/PaladinController";

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

        t = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t, Player(0), "-ai", true);
        TriggerAddAction(t, () => {

            let p = MapPlayer.fromIndex(1);
            // Create a paladin ai for them
            IssueNeutralImmediateOrderById(p.handle, GamePlayer.HeroSelect[p.id], Units.Paladin);
            let hero = GamePlayer.Hero[p.id];
            let ai = new PaladinController(hero, BlueCrystal, GamePlayer.Shop[p.id]);
            ai.Start();
        });
    }
}