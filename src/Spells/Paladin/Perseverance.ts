import { SpellEvent } from "Global/SpellEvent";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { Auras } from "Config";

export class Perseverance {
    public static SpellId: number;
    public static Aura: number = Auras.Perseverance;

    static init(spellId: number) {
        this.SpellId = spellId;

        SpellEvent.RegisterSpellEffect(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let hp = GetWidgetLife(target);

            let data = {
                maxLifeBonus: 34 + level,
                healing: 2,
            }

            if (GetUnitState(target, UNIT_STATE_MAX_LIFE) < data.maxLifeBonus) {
                UnitAddAbility(target, this.Aura);
                SetUnitAbilityLevel(target, this.Aura, 2);
                UnitRemoveAbility(target, this.Aura);
                SetWidgetLife(target, hp);
            } else if (UnitTypeFlags.IsUnitUndead(target)) {
                UnitDamageTarget(caster, target, data.healing, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
            } else {
                SetWidgetLife(target, hp + 2);
            }
        });
    }
}