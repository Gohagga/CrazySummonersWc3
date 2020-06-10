import { Buffs, Dummies, Models } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellHelper } from "Global/SpellHelper";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { OrbCostToString, OrbType } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";

export class UnholyCurse {
    public static SpellId: number;
    public static DummySpellId = Dummies.UnholyCurse;
    public static DummyOrder = "cripple";
    public static Buff: number = Buffs.UnholyCurse;
    public static readonly Sfx: string = "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdl";
    public static readonly TargetSfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl";
    public static CastSfx = Models.CastUnholy;
    public static OrbCost: OrbType[] = [];

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Purple,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let might = math.fmod((level-1), 4);
            let will = math.floor((level-1) / 4);

            let data = {
                done: false,

                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                // targetSfx: AddSpecialEffectTarget(this.TargetSfx, target, "origin"),
                damage: [ 1, 2, 2, 3 ][might],
                duration: [ 120, 100, 80, 60 ][will],
                castTime: 2,
                timer: CreateTimer()
            }

            // print(data.duration, data.damage);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                // DestroyEffect(data.targetSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;
                
                SpellHelper.DummyCastTarget(owner, GetUnitX(caster), GetUnitY(caster), target, this.DummySpellId, 1, this.DummyOrder);
                // DestroyEffect(AddSpecialEffectTarget(this.Sfx, target, "chest"));

                TimerStart(data.timer, data.duration, false, () => {

                    if (GetUnitAbilityLevel(target, this.Buff)) {
                        UnitRemoveAbility(target, this.Buff);
                        // Unleash the curse
                        if (UnitTypeFlags.IsUnitUndead(target)) {
                            SetWidgetLife(target, GetWidgetLife(target) + data.damage);
                        } else {
                            UnitDamageTarget(caster, target, data.damage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                        }
                    }
                    PauseTimer(data.timer);
                    DestroyTimer(data.timer);
                });
            });
            Interruptable.Register(caster, () => {

                if (!data.done) {
                    DestroyEffect(data.castSfx);
                    PauseTimer(data.timer);
                    DestroyTimer(data.timer);
                    cb.Destroy();
                    data.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
        for (let i = 0; i < 16; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}