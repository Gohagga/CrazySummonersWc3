import { Auras, Buffs, Dummies, Models } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup, SpellHelper } from "Global/SpellHelper";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { OrbCostToString, OrbType } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";

export class DeathVolley {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.DeathVolley;
    public static readonly DummyOrder = "shadowstrike";
    public static readonly Aura = Auras.AmzSpellImmunity;
    public static readonly BuffId = Buffs.AntimagicZone;
    public static readonly Sfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlCaster.mdl";
    public static CastSfx = Models.CastUnholy;
    public static OrbCost: OrbType[] = [];

    public static Filter(target: unit) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
                (IsUnitType(target, UNIT_TYPE_HERO) == false) &&
                (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Purple,
            OrbType.Blue,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                done: false,

                aoe: 350 + 100 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "chest"),
                targetCount: 2 + level,
                castTime: 2,
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);

                let u = FirstOfGroup(SpellGroup);
                while (u != null && data.targetCount > 0) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (this.Filter(u)) {
                        let isUndead = UnitTypeFlags.IsUnitUndead(u);
                        // Exit zone
                        if (isUndead == false && IsUnitAlly(u, owner) == false) {
                            SpellHelper.DummyCastTarget(owner, GetUnitX(caster), GetUnitY(caster), u, this.DummySpellId, level, this.DummyOrder);
                        } else if (isUndead && IsUnitAlly(u, owner) == true && GetWidgetLife(u) < GetUnitState(u, UNIT_STATE_MAX_LIFE)) {

                            if (GetUnitAbilityLevel(u, Buffs.CorruptedBlood) > 0) {
                                SpellHelper.DummyCastTarget(owner, GetUnitX(caster), GetUnitY(caster), u, this.DummySpellId, 5, this.DummyOrder);
                            } else {
                                SpellHelper.DummyCastTarget(owner, GetUnitX(caster), GetUnitY(caster), u, this.DummySpellId, level + 5, this.DummyOrder);
                            }
                        } else {
                            data.targetCount++;
                        }
                        data.targetCount--;
                    }
                    u = FirstOfGroup(SpellGroup);
                }
            });
            Interruptable.Register(caster, () => {

                if (!data.done) {
                    DestroyEffect(data.castSfx);
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