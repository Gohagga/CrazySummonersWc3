import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { Auras, Models } from "Config";

export class Exorcism {
    public static SpellId: number;
    public static Aura = Auras.GuardianAngel;
    public static AuraReincarnation = Auras.Reincarnation;
    public static readonly KillSfx: string = "Abilities\\Spells\\Human\\DivineShield\\DivineShieldTarget.mdl";
    public static readonly DamageSfx: string = "Abilities\\Spells\\Human\\Resurrect\\ResurrectTarget.mdl";
    public static CastSfx = Models.CastRepentance;

    private lifeCostPerTick = 0;
    private killsPerTick = 0;
    private buffer = 0;

    public static Filter(target: unit, owner: player) {
        return (
            UnitTypeFlags.IsUnitDemon(target) ||
            UnitTypeFlags.IsUnitHorror(target) ||
            UnitTypeFlags.IsUnitUndead(target)) &&
            (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetRectCenterX(gg_rct_Battleground);
            const y = GetRectCenterY(gg_rct_Battleground);
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            if (!ResourceBar.Get(owner).Consume([
                OrbType.White,
                OrbType.White,
                OrbType.Red,
                OrbType.Purple
            ])) return;

            let data = {
                minimumHealth: 4,
                hpPerTick: [ 1, 0.5, 0.25, 0 ][level - 1],
                hitsPerTick: 1 + math.floor(level * 0.5),
                hitBuffer: 0,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 10,
                tickDuration: 1,
                damage: 800,
                timer: CreateTimer()
            }

            TimerStart(data.timer, data.tickDuration, true, () => {

                let unitWasKilled = false;
                if (data.hitBuffer <= 0) {
                    data.hitBuffer += data.hitsPerTick;
                }
                GroupEnumUnitsInRect(SpellGroup, gg_rct_Battleground, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null && data.hitBuffer > 0) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (this.Filter(u, owner)) {
                        DestroyEffect(AddSpecialEffectLoc(this.DamageSfx, GetUnitLoc(u)));
                        UnitApplyTimedLife(u, FourCC('B000'), 0.6);
                        DestroyEffect(AddSpecialEffectTarget(this.KillSfx, u, "chest"));
                        unitWasKilled = true;
                        data.hitBuffer--;
                    }
                    u = FirstOfGroup(SpellGroup);
                }
                if (unitWasKilled) {
                    UnitDamageTarget(caster, caster, data.hpPerTick, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                }
                if (GetWidgetLife(caster) < data.minimumHealth) {
                    IssueImmediateOrder(caster, "stop");
                }
            });
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                PauseTimer(data.timer);
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    PauseTimer(data.timer);
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
    }
}