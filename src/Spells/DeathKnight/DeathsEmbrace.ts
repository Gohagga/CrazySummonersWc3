import { Dummies, Models, SpawnedUnitTypes } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { OrbCostToString, OrbType } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { UnitCharge } from "Systems/UnitCharge";

export class DeathsEmbrace {
    public static SpellId: number;
    public static DummySpellId = Dummies.ContagiousInsanity;
    public static DummyOrder = "bloodlust";
    private static SpawnedType = SpawnedUnitTypes.Undead.slice(10);
    public static readonly Sfx: string = "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdl";
    public static readonly TargetSfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl";
    public static CastSfx = Models.CastSacrifice;
    public static OrbCost: OrbType[] = [];

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Blue,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let life = GetUnitState(target, UNIT_STATE_MAX_LIFE);

            let data = {
                done: false,

                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                // targetSfx: AddSpecialEffectTarget(this.TargetSfx, target, "origin"),
                damage: life * (0.35 + 0.15 * level),
                threshold: 0.9 - 0.1 * level,
                castTime: 1.5
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                // DestroyEffect(data.targetSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;
                
                DestroyEffect(AddSpecialEffectTarget(this.Sfx, target, "chest"));
                let hp = GetWidgetLife(target);
                if (UnitTypeFlags.IsUnitUndead(target)) {
                    UnitDamageTarget(caster, target, data.damage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                } else if (hp / life > data.threshold) {                    
                    
                    let handleId = GetHandleId(target);
                    let rep = ReplaceUnitBJ(target, this.SpawnedType[GetUnitLevel(target)], bj_UNIT_STATE_METHOD_MAXIMUM);
                    UnitCharge.Reregister(rep, handleId);

                    RemoveGuardPosition(rep);
                    SetWidgetLife(rep, hp);
                } else {
                    UnitDamageTarget(caster, target, hp * 0.3, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                }
            });
            Interruptable.Register(caster, () => {

                if (!data.done) {
                    DestroyEffect(data.castSfx);
                    // DestroyEffect(data.targetSfx);
                    cb.Destroy();
                    data.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
        for (let i = 0; i < 4; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}