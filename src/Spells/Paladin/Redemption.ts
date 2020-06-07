import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { SpawnPoint } from "Spells/Spawn";
import { GamePlayer } from "Systems/GamePlayer";
import { UnitCharge } from "Systems/UnitCharge";
import { Models, Buffs } from "Config";

export class Redemption {
    public static SpellId: number;
    public static readonly ResurrectSfx: string = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl";
    public static readonly HealSfx: string = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl";
    public static CastSfx = Models.CastRestoration;

    public static Filter(target: unit) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let sp = SpawnPoint.FromTarget(target);
            if (!sp) return;

            let data = {
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                healPercent: 0.2 + level * 0.05,
                revivePercent: level * 0.2,
                castTime: 4 - 0.5 * level,
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.White,
                    OrbType.White,
                    OrbType.Red,
                    OrbType.Blue,
                ])) return;
                
                GroupEnumUnitsInRect(SpellGroup, sp.region, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (this.Filter(u)) {

                        let notCorrupted = GetUnitAbilityLevel(target, Buffs.CorruptedBlood) < 1;
                        let unitHp = GetWidgetLife(u);
                        // If unit is alive, we heal it
                        if (IsUnitAlly(u, owner) && unitHp > 0.405) {
                            DestroyEffect(AddSpecialEffectTarget(this.HealSfx, u, "origin"));
                            if (notCorrupted) {
                                SetWidgetLife(u, GetWidgetLife(u)+ data.healPercent * GetUnitState(u, UNIT_STATE_MAX_LIFE));
                            }
                        } else if (unitHp <= 0.405 || IsUnitType(u, UNIT_TYPE_DEAD)) {
                            let handleId = GetHandleId(u);
                            u = ReplaceUnitBJ(u, GetUnitTypeId(u), bj_UNIT_STATE_METHOD_MAXIMUM);
                            UnitCharge.Reregister(u, handleId);
                            
                            RemoveGuardPosition(u);
                            SetWidgetLife(u, GetWidgetLife(u) * data.revivePercent);
                            DestroyEffect(AddSpecialEffectTarget(this.ResurrectSfx, u, "origin"));
                            
                            if (GetOwningPlayer(u) != sp.owner) {
                                SetUnitOwner(u, sp.owner, true);
                            }
                        }
                    }
                    u = FirstOfGroup(SpellGroup);
                }
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