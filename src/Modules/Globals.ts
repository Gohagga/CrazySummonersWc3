import { WardSpell } from "Systems/WardSpell";

import { SpawnPoint } from "Spells/Spawn";

export const GROUP = CreateGroup();

export function InitializeGlobals() {

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