import { HeroProgression } from "Systems/HeroProgression";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { DelayFunction } from "Global/DelayFunction";
import { DarkPower } from "Spells/Warlock/DarkPower";
import { Spells, Items, Upgrades } from "Config";
import { MasteryReq } from "Modules/Globals";

export class WarlockProgression extends HeroProgression {
    
    constructor(unit: unit) {
        super(unit);
    }

    public ProgressFunction(unit: unit) {

        let owner = GetOwningPlayer(unit);
        let bar = ResourceBar.Get(owner);
        
        DelayFunction.SmoothRun(0.2, () => {
            bar.AddOrb(OrbType.Summoning);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Summoning);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Summoning);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Purple);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Purple);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Red);
        });
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        UnitAddAbility(unit, Spells.SummonEvilOutsider);
        UnitAddAbility(unit, Spells.DarkPower);
        let wps = UnitAddItemById(unit, Items.DarkFocusBase);
        DarkPower.StartChargeUp(unit, wps);

        HeroProgression.WaitForUnitLevel(this.unit, 3);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 5);
        bar.AddOrb(OrbType.Purple);

        HeroProgression.WaitForUnitLevel(this.unit, 6)
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 7);
        MasteryReq.Increase(owner);
        SetPlayerTechResearched(GetOwningPlayer(unit), Upgrades.SpellCircle, 1);

        HeroProgression.WaitForUnitLevel(this.unit, 9);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        
        HeroProgression.WaitForUnitLevel(this.unit, 10);
        bar.AddOrb(OrbType.Purple);

        HeroProgression.WaitForUnitLevel(this.unit, 11);
        MasteryReq.Increase(owner);
        SetPlayerTechResearched(GetOwningPlayer(unit), Upgrades.SpellCircle, 2);

        HeroProgression.WaitForUnitLevel(this.unit, 13);
        
        HeroProgression.WaitForUnitLevel(this.unit, 15);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        // bar.AddOrb(OrbType.Purple);

        HeroProgression.WaitForUnitLevel(this.unit, 16);
        // SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 19);
        // SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        // UnitAddItemById(unit, ITEMS.PaladinBook2)
        // SetPlayerTechResearched(GetOwningPlayer(unit), UPGRADES.SpellCircle, 2)

        // HeroProgression.waitForUnitLevel(unit, 15)
        // UnitAddItemById(unit, ITEMS.PaladinBook3)
        // SetPlayerTechResearched(GetOwningPlayer(unit), UPGRADES.SpellCircle, 3)

    }
}