import { SpellEvent } from "Global/SpellEvent";
import { Spells } from "Config";

export class PaladinMastery {

    static init() {

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL);
        TriggerAddAction(t, () => {
            let u = GetTriggerUnit();
            let spellId = GetLearnedSkill();
            if (spellId != Spells.PaladinMastery) return;

            let level = GetLearnedSkillLevel() + 1;

            if (GetUnitAbilityLevel(u, Spells.PaladinRestoration) > 0) {
                SetUnitAbilityLevel(u, Spells.PaladinRestoration, level);
                
                SetUnitAbilityLevel(u, Spells.Rejuvenate, level);
                SetUnitAbilityLevel(u, Spells.Invigorate, level);
                SetUnitAbilityLevel(u, Spells.Redemption, level);
                
            } else if (GetUnitAbilityLevel(u, Spells.PaladinDetermination) > 0) {
                SetUnitAbilityLevel(u, Spells.PaladinDetermination, level);

                SetUnitAbilityLevel(u, Spells.Bless, level);
                SetUnitAbilityLevel(u, Spells.Endure, level);
                SetUnitAbilityLevel(u, Spells.GuardianAngel, level);
                
            } else if (GetUnitAbilityLevel(u, Spells.PaladinRepentance) > 0) {
                SetUnitAbilityLevel(u, Spells.PaladinRepentance, level);

                SetUnitAbilityLevel(u, Spells.Purge, level);
                SetUnitAbilityLevel(u, Spells.Justice, level);
                SetUnitAbilityLevel(u, Spells.Exorcism, level);
                
            }
        });

        SpellEvent.RegisterSpellEffect(Spells.PalLearnRestoration, () => {
            let u = GetTriggerUnit();
            let lvl = GetUnitAbilityLevel(u, Spells.PaladinMastery) + 1;
            UnitRemoveAbility(u, Spells.PaladinLearnMastery);
            UnitAddAbility(u, Spells.PaladinRestoration);
            SetUnitAbilityLevel(u, Spells.PaladinRestoration, lvl);
            SetUnitAbilityLevel(u, Spells.Rejuvenate, lvl);
            SetUnitAbilityLevel(u, Spells.Invigorate, lvl);
            SetUnitAbilityLevel(u, Spells.Redemption, lvl);
        });
        SpellEvent.RegisterSpellEffect(Spells.PalLearnDetermination, () => {
            let u = GetTriggerUnit();
            let lvl = GetUnitAbilityLevel(u, Spells.PaladinMastery) + 1;
            UnitRemoveAbility(u, Spells.PaladinLearnMastery);
            UnitAddAbility(u, Spells.PaladinDetermination);
            SetUnitAbilityLevel(u, Spells.PaladinDetermination, lvl);
            SetUnitAbilityLevel(u, Spells.Bless, lvl);
            SetUnitAbilityLevel(u, Spells.Endure, lvl);
            SetUnitAbilityLevel(u, Spells.GuardianAngel, lvl);
        });
        SpellEvent.RegisterSpellEffect(Spells.PalLearnRepentance, () => {
            let u = GetTriggerUnit();
            let lvl = GetUnitAbilityLevel(u, Spells.PaladinMastery) + 1;
            UnitRemoveAbility(u, Spells.PaladinLearnMastery);
            UnitAddAbility(u, Spells.PaladinRepentance);
            SetUnitAbilityLevel(u, Spells.PaladinRepentance, lvl);
            SetUnitAbilityLevel(u, Spells.Purge, lvl);
            SetUnitAbilityLevel(u, Spells.Justice, lvl);
            SetUnitAbilityLevel(u, Spells.Exorcism, lvl);
        });
    }
}