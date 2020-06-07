import { BloodFeast } from "Spells/Warlock/BloodFeast";
import { CorruptedBlood } from "Spells/DeathKnight/CorruptedBlood";



export class Dispel {

    static DispelUnitTier1(u: unit) {
        UnitRemoveAbility(u, BloodFeast.AuraDamage);
        CorruptedBlood.RemoveBuff(u);
    }
}