import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Models } from "Config";

export class StealEssence {
    public static SpellId: number;
    public static readonly DamageSfx: string = "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl";
    public static readonly KillSfx: string = "Objects\\Spawnmodels\\Undead\\UndeadDissipate\\UndeadDissipate.mdl";
    public static readonly HealSfx: string = "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl";
    public static CastSfx = Models.CastShadow;

    public static GetDamage(spellLevel: number, unitLevel: number) {
        if (unitLevel > 15) {
            unitLevel = 15;
        }
        return (0.2 + 0.4 * spellLevel) * (161 + 51 * unitLevel);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                aoe: 360,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "chest"),
                damage: this.GetDamage(level, GetUnitLevel(caster)),
                castTime: [ 3.0, 2.5, 2.0, 1.5 ][level - 1]
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Purple,
                    OrbType.Purple,
                    OrbType.Blue,
                    OrbType.Red
                ])) return;

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                let unitsToDamage: unit[] = [];
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) == false && GetWidgetLife(u) > 0.405 && IsUnitType(u, UNIT_TYPE_STRUCTURE) == false && IsUnitType(u, UNIT_TYPE_MECHANICAL) == false && IsUnitType(u, UNIT_TYPE_HERO) == false) {
                        unitsToDamage.push(u);
                    }
                    // SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
                    u = FirstOfGroup(SpellGroup);
                }

                let singleDamage = data.damage / unitsToDamage.length;
                let hasGainedHp = false;
                for (let unit of unitsToDamage) {
                    UnitDamageTarget(caster, unit, singleDamage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
                    DestroyEffect(AddSpecialEffectTarget(this.DamageSfx, unit, "origin"));
                    if (GetWidgetLife(unit) <= 0.405) {
                        SetWidgetLife(caster, GetWidgetLife(caster) + 1);
                        hasGainedHp = true;
                        DestroyEffect(AddSpecialEffectTarget(this.KillSfx, unit, "origin"));
                    }
                }

                if (hasGainedHp) {
                    DestroyEffect(AddSpecialEffectTarget(this.HealSfx, caster, "origin"));
                }

                IssueImmediateOrder(caster, "stop");
                QueueUnitAnimation(caster, "spell");
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
    }
}