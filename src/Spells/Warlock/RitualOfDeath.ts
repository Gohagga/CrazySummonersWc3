import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Dummies, Models } from "Config";

export class RitualOfDeath {
    public static SpellId: number;
    public static DummySpellId = Dummies.ContagiousInsanity;
    public static DummyOrder = "bloodlust";
    public static readonly Sfx: string = Models.CorpseBomb;
    public static readonly TargetSfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl";
    public static CastSfx = Models.CastSacrifice;

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                targetSfx: AddSpecialEffectTarget(this.TargetSfx, target, "origin"),
                nonDamageChance: 0.05 * level + 0.05,
                castTime: 7.0 - 1.5 * level
            }
            // BlzSetSpecialEffectScale(data.castSfx, 2.2);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                DestroyEffect(data.targetSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Purple,
                    OrbType.Red
                ])) return;

                if (math.random() > data.nonDamageChance) {
                    UnitDamageTarget(caster, caster, 1, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                }

                if (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) {
                    DestroyEffect(AddSpecialEffectTarget(this.Sfx, target, "chest"));
                    // DestroyEffect(AddSpecialEffect(this.Sfx, GetUnitX(target), GetUnitY(target)));
                    UnitDamageTarget(caster, target, GetUnitState(target, UNIT_STATE_MAX_LIFE), false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                }

                IssueImmediateOrder(caster, "stand");
                QueueUnitAnimation(caster, "spell");
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    DestroyEffect(data.targetSfx);
                    cb.Destroy();
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
    }
}