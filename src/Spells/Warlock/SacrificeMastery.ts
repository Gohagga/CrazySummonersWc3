import { Spells } from "Config";

export class SacrificeMastery {
    public static SpellId: number;

    static init(spellId: number) {
        this.SpellId = spellId;

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL);
        TriggerAddAction(t, () => {
            let u = GetTriggerUnit();
            let spellId = GetLearnedSkill();
            if (spellId != this.SpellId) return;

            let level = GetLearnedSkillLevel() + 1;
            
            SetUnitAbilityLevel(u, Spells.Taint, level);
            SetUnitAbilityLevel(u, Spells.RitualOfDeath, level);
            SetUnitAbilityLevel(u, Spells.BloodFeast, level);
        });
    }
}