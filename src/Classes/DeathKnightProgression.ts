import { HeroProgression } from "Systems/HeroProgression";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { DelayFunction } from "Global/DelayFunction";
import { DarkPower } from "Spells/Warlock/DarkPower";
import { RedPower } from "Spells/DeathKnight/RedPower";
import { Spells, Items, Upgrades } from "Config";
import { DarkArts } from "Spells/DeathKnight/DarkArts";

export class DeathKnightProgression extends HeroProgression {
    
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
            bar.AddOrb(OrbType.Red);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Red);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Red);
        });
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        DarkArts.Initialize(unit);
        
        UnitAddAbility(unit, Spells.SummonGhoul);
        UnitAddAbility(unit, Spells.RedPower);
        let rps = UnitAddItemById(unit, Items.RedPowerStacks);
        RedPower.StartChargeUp(rps);
        UnitAddItem(unit, CreateItem(DarkArts.BookId, 0, 0));

        HeroProgression.WaitForUnitLevel(this.unit, 3);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 5);
        bar.AddOrb(OrbType.Red);

        HeroProgression.WaitForUnitLevel(this.unit, 6)
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 7);
        SetPlayerTechResearched(GetOwningPlayer(unit), Upgrades.SpellCircle, 1);
        UnitAddItem(unit, CreateItem(DarkArts.BookId, 0, 0));

        HeroProgression.WaitForUnitLevel(this.unit, 9);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        
        HeroProgression.WaitForUnitLevel(this.unit, 10);
        bar.AddOrb(OrbType.Red);

        HeroProgression.WaitForUnitLevel(this.unit, 11);
        SetPlayerTechResearched(GetOwningPlayer(unit), Upgrades.SpellCircle, 2);
        UnitAddItem(unit, CreateItem(DarkArts.BookId, 0, 0));


        HeroProgression.WaitForUnitLevel(this.unit, 13);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 15);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 16);

        HeroProgression.WaitForUnitLevel(this.unit, 19);
        // UnitAddItemById(unit, ITEMS.PaladinBook2)
        // SetPlayerTechResearched(GetOwningPlayer(unit), UPGRADES.SpellCircle, 2)

        // HeroProgression.waitForUnitLevel(unit, 15)
        // UnitAddItemById(unit, ITEMS.PaladinBook3)
        // SetPlayerTechResearched(GetOwningPlayer(unit), UPGRADES.SpellCircle, 3)

    }
}