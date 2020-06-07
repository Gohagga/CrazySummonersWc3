import { SpellEvent } from "Global/SpellEvent";
import { Spells } from "Config";

export class DeathKnightMightWill {

    static init() {

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL);
        TriggerAddAction(t, () => {
            let spellId = GetLearnedSkill();
            if (spellId != Spells.DeathKnightMight && spellId != Spells.DeathKnightWill) {
                return;
            }
            let u = GetTriggerUnit();

            let might = GetUnitAbilityLevel(u, Spells.DeathKnightMight);
            let will = GetUnitAbilityLevel(u, Spells.DeathKnightWill);
            let mix = 1 + will * 4 + might;

            if (spellId == Spells.DeathKnightMight) {

                SetUnitAbilityLevel(u, Spells.VolatileLeeches, might + 1);
                SetUnitAbilityLevel(u, Spells.DeathVolley, might + 1);
                SetUnitAbilityLevel(u, Spells.DeathsEmbrace, might + 1);

                SetUnitAbilityLevel(u, Spells.VampiresBoon, mix);
                SetUnitAbilityLevel(u, Spells.UnholyCurse, mix);
                SetUnitAbilityLevel(u, Spells.ArmyOfTheDead, mix);

            } else if (spellId == Spells.DeathKnightWill) {

                SetUnitAbilityLevel(u, Spells.CorruptedBlood, will + 1);
                SetUnitAbilityLevel(u, Spells.AntimagicZone, will + 1);
                SetUnitAbilityLevel(u, Spells.DeathAndDecay, will + 1);

                SetUnitAbilityLevel(u, Spells.VampiresBoon, mix);
                SetUnitAbilityLevel(u, Spells.UnholyCurse, mix);
                SetUnitAbilityLevel(u, Spells.ArmyOfTheDead, mix);

            }
        });
    }
}