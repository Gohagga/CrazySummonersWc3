import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { Dispel } from "Systems/Dispel";
import { Dummies, Models } from "Config";

export class Purge {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Purge;
    public static readonly DummyOrder = "dispel";
    public static readonly DamageSfx: string = "Abilities/Spells/Human/HolyBolt/HolyBoltSpecialArt.mdl";
    public static readonly Sfx: string = Models.SingularityOrange;
    public static CastSfx = Models.CastRepentance;

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                aoe: 300 + 50 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: [ 1.5, 1.2, 0.9, 0.6 ][level - 1],
                damage: 100 + level * 50
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.White,
                    OrbType.White,
                    OrbType.Red
                ])) return;

                // DestroyEffect(AddSpecialEffect(this.Sfx, x, y));

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    if ((UnitTypeFlags.IsUnitUndead(u) || UnitTypeFlags.IsUnitDemon(u)) &&
                        IsUnitAlly(u, owner) == false && GetWidgetLife(u) > 0.405 && IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) == false) {
                        UnitDamageTarget(caster, u, data.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_DIVINE, WEAPON_TYPE_WHOKNOWS);
                        DestroyEffect(AddSpecialEffectTarget(this.DamageSfx, u, "origin"));
                    }
                    Dispel.DispelUnitTier1(u);
                    u = FirstOfGroup(SpellGroup);
                }
                SpellHelper.DummyCastPoint(owner, x, y, x, y, this.DummySpellId, level, this.DummyOrder);
                IssueImmediateOrder(caster, "spell");
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