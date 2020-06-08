import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Models } from "Config";

export class Justice {
    public static SpellId: number;
    public static readonly Sfx: string = "Abilities\\Spells\\Orc\\SpiritLink\\SpiritLinkTarget.mdl";
    public static readonly DamageSfx: string = "StormfallOrange.mdl";
    public static CastSfx = Models.CastRepentance;

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);

            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let coef1 = 1.0;
            let coef2 = 500.0;
            let life = GetUnitState(target, UNIT_STATE_MAX_LIFE);

            let data = {
                aoe: 100 + 150 * level,
                targetSfx: AddSpecialEffectTarget(this.Sfx, target, "chest"),
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: [ 3.5, 3, 2.5, 2 ][level - 1],
                damage: (life * coef1) / (life + coef2 - level * 100 + 100) * life
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                DestroyEffect(data.targetSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Purple,
                    OrbType.Red
                ])) return;

                UnitDamageTarget(caster, target, data.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                DestroyEffect(AddSpecialEffectTarget(this.DamageSfx, target, "origin"));

                IssueImmediateOrder(caster, "spell");
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