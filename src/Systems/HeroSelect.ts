import { DeathKnightProgression } from "Classes/DeathKnightProgression";
import { PaladinProgression } from "Classes/PaladinProgression";
import { WarlockProgression } from "Classes/WarlockProgression";
import { Units, Upgrades, Log } from "Config";
import { Cameras } from "./Cameras";
import { GamePlayer } from "./GamePlayer";
import { HeroProgression } from "./HeroProgression";
import { ResourceBar } from "./OrbResource/ResourceBar";
import { MapPlayer, Unit } from "w3ts/index";
import { RedCrystal, BlueCrystal } from "Modules/Globals";
import { PaladinController } from "AI/Paladin/PaladinController";
import { GroveTenderProgression } from "Classes/GroveTenderProgression";
import { ElementalistProgression } from "Classes/ElementalistProgression";

export class HeroSelect {

    static AISelect() {
        
        const players = [
            MapPlayer.fromIndex(0),
            MapPlayer.fromIndex(2),
            MapPlayer.fromIndex(3),

            MapPlayer.fromIndex(1),
            MapPlayer.fromIndex(4),
            MapPlayer.fromIndex(6),
        ];

        for (let p of players) {
            if (p.controller == MAP_CONTROL_COMPUTER && p.slotState == PLAYER_SLOT_STATE_PLAYING) {
                // Create a paladin ai for them
                IssueNeutralImmediateOrderById(p.handle, GamePlayer.HeroSelect[p.id], Units.Paladin);
                let hero = GamePlayer.Hero[p.id];
                Log.info("Red/Blue", RedCrystal.length, BlueCrystal.length);
                let crystals = p.isPlayerAlly(MapPlayer.fromIndex(0)) ? RedCrystal : BlueCrystal;
                Log.info(crystals.length);
                let ai = new PaladinController(hero, crystals, GamePlayer.Shop[p.id]);
                ai.Start();
            }
        }
    }

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
            } else if (id == Units.GroveTender) {
                HeroProgression.Register(new GroveTenderProgression(u));
            } else if (id == Units.Elementalist) {
                HeroProgression.Register(new ElementalistProgression(u));
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

        GamePlayer.Shop[0] = Unit.fromHandle(gg_unit_h00L_0019);
        GamePlayer.Shop[2] = Unit.fromHandle(gg_unit_h00L_0019);
        GamePlayer.Shop[3] = Unit.fromHandle(gg_unit_h00L_0019);
        GamePlayer.Shop[1] = Unit.fromHandle(gg_unit_h00L_0025);
        GamePlayer.Shop[4] = Unit.fromHandle(gg_unit_h00L_0025);
        GamePlayer.Shop[6] = Unit.fromHandle(gg_unit_h00L_0025);

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