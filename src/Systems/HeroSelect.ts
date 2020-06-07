import { DeathKnightProgression } from "Classes/DeathKnightProgression";
import { PaladinProgression } from "Classes/PaladinProgression";
import { WarlockProgression } from "Classes/WarlockProgression";
import { Units, Upgrades } from "Config";
import { Cameras } from "./Cameras";
import { GamePlayer } from "./GamePlayer";
import { HeroProgression } from "./HeroProgression";
import { ResourceBar } from "./OrbResource/ResourceBar";

export class HeroSelect {

    static init() {

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SELL);
        TriggerAddAction(t, () => {

            let u = GetSoldUnit();
            let owner = GetOwningPlayer(u);
            let id = GetUnitTypeId(u);

            let playerId = GetPlayerId(owner);
            if (GamePlayer.Hero[playerId]) {
                // SetHeroLevel(u, GetHeroLevel(GamePlayer.Hero[playerId]), true);
                SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, 0);
                RemoveUnit(GamePlayer.Hero[playerId]);
            }
            GamePlayer.Hero[playerId] = u;
            SetUnitPositionLoc(u, GamePlayer.SpawnPoint[playerId]);
            UnitAddType(u, UNIT_TYPE_PEON);
            
            BlzDecPlayerTechResearched(owner, Upgrades.SpellCircle, GetPlayerTechCountSimple(Upgrades.SpellCircle, owner));
            ResourceBar.ResetUpgrades(owner);
            ResourceBar.Register(new ResourceBar(owner));

            if (id == Units.Paladin) {
                HeroProgression.Register(new PaladinProgression(u));
            } else if (id == Units.Warlock) {
                HeroProgression.Register(new WarlockProgression(u));
            } else if (id == Units.DeathKnight) {
                HeroProgression.Register(new DeathKnightProgression(u));
            }

            Cameras.SetPlayerTeamCamera(owner);
            SelectUnitForPlayerSingle(u, owner);
        });

        GamePlayer.SpawnPoint[0] = GetUnitLoc(gg_unit_nDUM_0031);
        GamePlayer.SpawnPoint[2] = GetUnitLoc(gg_unit_nDUM_0031);
        GamePlayer.SpawnPoint[3] = GetUnitLoc(gg_unit_nDUM_0031);
        GamePlayer.SpawnPoint[1] = GetUnitLoc(gg_unit_nDUM_0033);
        GamePlayer.SpawnPoint[4] = GetUnitLoc(gg_unit_nDUM_0033);
        GamePlayer.SpawnPoint[6] = GetUnitLoc(gg_unit_nDUM_0033);

        GamePlayer.HeroSelect[0] = gg_unit_e000_0040;
        GamePlayer.HeroSelect[2] = gg_unit_e000_0040;
        GamePlayer.HeroSelect[3] = gg_unit_e000_0040;
        GamePlayer.HeroSelect[1] = gg_unit_e001_0016;
        GamePlayer.HeroSelect[4] = gg_unit_e001_0016;
        GamePlayer.HeroSelect[6] = gg_unit_e001_0016;

        let playerLeave = CreateTrigger();
        for (let i = 0; i < 7; i++) {
            SelectUnitForPlayerSingle(GamePlayer.HeroSelect[i], Player(i));
            TriggerRegisterPlayerEventLeave(playerLeave, Player(i));
        }
        TriggerAddAction(playerLeave, () => {
            print(GetPlayerName(GetTriggerPlayer()) + " left the game.");
        })
    }
}