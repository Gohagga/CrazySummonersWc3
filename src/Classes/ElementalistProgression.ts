import { HeroProgression } from "Systems/HeroProgression";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { DelayFunction } from "Global/DelayFunction";
import { OrbType } from "Systems/OrbResource/Orb";
import { MasteryReq } from "Modules/Globals";
import { Spells, Items, Upgrades } from "Config";
import { WhitePower } from "Spells/Paladin/WhitePower";

export class ElementalistProgression extends HeroProgression {
    
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
            bar.AddOrb(OrbType.Blue);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Blue);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Purple);
        }).Then(0.2, () => {
            bar.AddOrb(OrbType.Purple);
        });
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        MasteryReq.Decrease(owner, MasteryReq.Get(owner));
        // UnitAddAbility(unit, Spells.SummonSeedling);
        // UnitAddAbility(unit, Spells.Photosynthesis);
        // let wps = UnitAddItemById(unit, Items.WhitePowerStacks);
        // WhitePower.StartChargeUp(wps);

        HeroProgression.WaitForUnitLevel(this.unit, 3);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);

        HeroProgression.WaitForUnitLevel(this.unit, 5);
        bar.AddOrb(OrbType.Red);
        
        HeroProgression.WaitForUnitLevel(this.unit, 6)
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        UnitAddAbility(unit, Spells.PaladinLearnMastery);
        SelectHeroSkill(unit, FourCC("A00F"));
        
        HeroProgression.WaitForUnitLevel(this.unit, 7);
        MasteryReq.Increase(owner);
        SetPlayerTechResearched(GetOwningPlayer(unit), Upgrades.SpellCircle, 1);

        HeroProgression.WaitForUnitLevel(this.unit, 9);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        
        HeroProgression.WaitForUnitLevel(this.unit, 10);
        bar.AddOrb(OrbType.Red);

        HeroProgression.WaitForUnitLevel(this.unit, 11);
        MasteryReq.Increase(owner);
        SetPlayerTechResearched(GetOwningPlayer(unit), Upgrades.SpellCircle, 2);

        HeroProgression.WaitForUnitLevel(this.unit, 13);
        
        HeroProgression.WaitForUnitLevel(this.unit, 15);
        SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1);
        // bar.AddOrb(OrbType.White);

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