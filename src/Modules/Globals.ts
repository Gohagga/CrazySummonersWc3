import { WardSpell } from "Systems/WardSpell";

import { SpawnPoint } from "Spells/Spawn";
import { UnitRequirement } from "Systems/Requirement/UnitRequirement";
import { IRequirement } from "Systems/Requirement/IRequirement";
import { Units, ReqUnits, Log } from "Config";
import { RequirementTracker, RequirementType } from "Systems/Requirement/RequirementTracker";
import { Unit } from "w3ts/index";

export const GROUP = CreateGroup();

export const PurpleOrbReq: IRequirement = new UnitRequirement(ReqUnits.PurpleOrbs);
export const BlueOrbReq: IRequirement = new UnitRequirement(ReqUnits.BlueOrbs);
export const WhiteOrbReq: IRequirement = new UnitRequirement(ReqUnits.WhiteOrbs);
export const SummonOrbReq: IRequirement = new UnitRequirement(ReqUnits.SummoningOrbs);
export const RedOrbReq: IRequirement = new UnitRequirement(ReqUnits.RedOrbs);
export const MasteryReq: IRequirement = new UnitRequirement(ReqUnits.RedOrbs);

export const DarkArtBloodReq: IRequirement = new UnitRequirement(ReqUnits.Blank);
export const DarkArtUnholyReq: IRequirement = new UnitRequirement(ReqUnits.Blank);
export const DarkArtNecromancyReq: IRequirement = new UnitRequirement(ReqUnits.Blank);

export const UpgradeTracker: RequirementTracker = new RequirementTracker({
    [RequirementType.Purple]: PurpleOrbReq,
    [RequirementType.Blue]: BlueOrbReq,
    [RequirementType.White]: WhiteOrbReq,
    [RequirementType.Summoning]: SummonOrbReq,
    [RequirementType.Red]: RedOrbReq,
    [RequirementType.Mastery]: MasteryReq,
    [RequirementType.DarkArtBlood]: DarkArtBloodReq,
    [RequirementType.DarkArtUnholy]: DarkArtUnholyReq,
    [RequirementType.DarkArtNecromancy]: DarkArtNecromancyReq,
});

export const BlueCrystal: Unit[] = [];
export const RedCrystal: Unit[] = [];

export function InitializeGlobals() {

    // const BlueOrbReq: IRequirement = new UnitRequirement(ReqUnits.BlueOrbs);
    // const PurpleOrbReq: IRequirement = new UnitRequirement(ReqUnits.PurpleOrbs);
    // const WhiteOrbReq: IRequirement = new UnitRequirement(ReqUnits.WhiteOrbs);
    // const SummonOrbReq: IRequirement = new UnitRequirement(ReqUnits.SummoningOrbs);
    // const RedOrbReq: IRequirement = new UnitRequirement(ReqUnits.RedOrbs);

    BlueCrystal.push(Unit.fromHandle(gg_unit_h002_0009));
    BlueCrystal.push(Unit.fromHandle(gg_unit_h002_0010));
    BlueCrystal.push(Unit.fromHandle(gg_unit_h002_0011));
    BlueCrystal.push(Unit.fromHandle(gg_unit_h002_0012));
    BlueCrystal.push(Unit.fromHandle(gg_unit_h002_0013));

    RedCrystal.push(Unit.fromHandle(gg_unit_h001_0014));
    RedCrystal.push(Unit.fromHandle(gg_unit_h001_0008));
    RedCrystal.push(Unit.fromHandle(gg_unit_h001_0006));
    RedCrystal.push(Unit.fromHandle(gg_unit_h001_0004));
    RedCrystal.push(Unit.fromHandle(gg_unit_h001_0015));

    WardSpell.RegisterWardTarget(gg_unit_h001_0014, SpawnPoint.FromTarget(gg_unit_h001_0014));
    WardSpell.RegisterWardTarget(gg_unit_h001_0008, SpawnPoint.FromTarget(gg_unit_h001_0008));
    WardSpell.RegisterWardTarget(gg_unit_h001_0006, SpawnPoint.FromTarget(gg_unit_h001_0006));
    WardSpell.RegisterWardTarget(gg_unit_h001_0004, SpawnPoint.FromTarget(gg_unit_h001_0004));
    WardSpell.RegisterWardTarget(gg_unit_h001_0015, SpawnPoint.FromTarget(gg_unit_h001_0015));
    WardSpell.RegisterWardTarget(gg_unit_h002_0009, SpawnPoint.FromTarget(gg_unit_h002_0009));
    WardSpell.RegisterWardTarget(gg_unit_h002_0010, SpawnPoint.FromTarget(gg_unit_h002_0010));
    WardSpell.RegisterWardTarget(gg_unit_h002_0011, SpawnPoint.FromTarget(gg_unit_h002_0011));
    WardSpell.RegisterWardTarget(gg_unit_h002_0012, SpawnPoint.FromTarget(gg_unit_h002_0012));
    WardSpell.RegisterWardTarget(gg_unit_h002_0013, SpawnPoint.FromTarget(gg_unit_h002_0013));
    
}