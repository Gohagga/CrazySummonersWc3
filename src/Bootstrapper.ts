import { GamePlayer } from "Systems/GamePlayer";
import { PreloadSpells, InitializeSpells } from "Modules/Spells";
import { SpellEvent } from "Global/SpellEvent";
import { Interruptable } from "Global/Interruptable";
import { SpawnPoint } from "Spells/Spawn";
import { HeroProgression } from "Systems/HeroProgression";
import { HeroSelect } from "Systems/HeroSelect";
import { UnitCharge } from "Systems/UnitCharge";
import { GameRound } from "Systems/GameRound";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { PaladinMastery } from "Classes/PaladinMastery";
import { DeathKnightMightWill } from "Classes/DeathKnightMightWill";
import { Cameras } from "Systems/Cameras";
import { Commands } from "Systems/Commands";
import { ArcaneTomeShop } from "Systems/ArcaneTomeShop";
import { OrbView } from "Systems/OrbResource/OrbView";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { InitializeGlobals } from "Modules/Globals";
import { InitConfiguration } from "Config";

export class Bootstrapper {

    static ConfigureServices() {

        InitConfiguration();

        GamePlayer.init();
        SpellEvent.init();
        Interruptable.init();
        SpawnPoint.init();
        HeroProgression.init();
        HeroSelect.init();
        UnitCharge.init();
        GameRound.init();
        UnitTypeFlags.init();

        // // Classes
        PaladinMastery.init();
        DeathKnightMightWill.init();

        // // Utility
        Cameras.init();
        Commands.init();
        ArcaneTomeShop.init();

        TimerStart(CreateTimer(), 0.1, false, () => {
            OrbView.init();
            ResourceBar.init();
            InitializeGlobals();
            InitializeSpells();
        });
        PreloadSpells();
    }
}