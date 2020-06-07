import { SpellEvent } from "Global/SpellEvent";
import { Order } from "Global/Order";
import { Auras, Buffs, Spells } from "Config";

export class DemonismShadowcraft {
    private static SpellId: number;

    public static AddDemonism(caster: unit) {
            
        let level = GetUnitAbilityLevel(caster, this.SpellId);

        UnitAddAbility(caster, Auras.Demonism);
        SetUnitAbilityLevel(caster, Auras.Demonism, level);
        if (level > 2) {
            this.SwitchSpellLevels(caster, math.floor(level / 3) + 1, Buffs.Demonism);
        }
    }

    public static SwitchSpellLevels(caster: unit, level: number, modeBuffId: number) {

        let demo = 1;
        let shadow = 1;

        if (modeBuffId == Buffs.Demonism) {
            demo = level;
        } else if (modeBuffId == Buffs.Shadowcraft) {
            shadow = level;
        }

        SetUnitAbilityLevel(caster, Spells.CrazyImp, demo);
        SetUnitAbilityLevel(caster, Spells.DarkPortal, demo);
        // SetUnitAbilityLevel(caster, Spells., demo);

        SetUnitAbilityLevel(caster, Spells.ContagiousInsanity, shadow);
        SetUnitAbilityLevel(caster, Spells.StealEssence, shadow);
        // SetUnitAbilityLevel(caster, Spells.Paranoia, shadow);
    }

    static init(spellId: number) {
        this.SpellId = spellId;

        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            if (GetUnitAbilityLevel(caster, Auras.Shadowcraft) > 0) {
                UnitAddAbility(caster, Auras.Demonism);
                SetUnitAbilityLevel(caster, Auras.Demonism, level);
                if (level > 2) {
                    this.SwitchSpellLevels(caster, math.floor(level / 3) + 1, Buffs.Demonism);
                }
            } else {
                UnitRemoveAbility(caster, Auras.Demonism);
                UnitRemoveAbility(caster, Buffs.Demonism);
                if (level > 2)
                    this.SwitchSpellLevels(caster, math.floor(level / 3) + 1, Buffs.Shadowcraft);
            }
        });

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_ORDER);
        TriggerAddCondition(t, Condition(() => GetIssuedOrderId() == Order.UNIMMOLATION && GetUnitAbilityLevel(GetTriggerUnit(), this.SpellId) > 0))
        TriggerAddAction(t, () => this.AddDemonism(GetTriggerUnit()));

        t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL);
        TriggerAddCondition(t, Condition(() => GetLearnedSkill() == this.SpellId && GetLearnedSkillLevel() == 1 ));
        TriggerAddAction(t, () => this.AddDemonism(GetTriggerUnit()));
    }
}