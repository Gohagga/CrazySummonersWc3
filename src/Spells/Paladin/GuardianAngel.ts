import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType, OrbCostToString } from "Systems/OrbResource/Orb";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Models, Auras, Units } from "Config";

export class GuardianAngel {
    public static SpellId: number;
    public static readonly Sfx: string = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl";
    public static CastSfx = Models.CastDetermination;
    public static Aura = Auras.GuardianAngel;
    public static AuraReincarnation = Auras.Reincarnation;
    public static OrbCost: OrbType[] = [];

    public static Filter(target: unit, owner: player) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (IsUnitAlly(target, owner)) &&
            (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.White,
            OrbType.White,
            OrbType.Blue,
            OrbType.Purple,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetRectCenterX(gg_rct_Battleground);
            const y = GetRectCenterY(gg_rct_Battleground);
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                duration: 3.5 + 1.5 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 4 - 0.75 * level,
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                let dummy = CreateUnit(owner, Units.NegativeZDummy, x, y, 0);
                UnitAddAbility(dummy, this.Aura);
                UnitApplyTimedLife(dummy, FourCC('B000'), data.duration);
                SetUnitScale(dummy, 10, 10, 1);

                GroupEnumUnitsInRect(SpellGroup, gg_rct_Battleground, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (this.Filter(u, owner)) {
                        UnitAddAbility(u, this.AuraReincarnation);
                        DestroyEffect(AddSpecialEffectTarget(this.Sfx, u, "origin"));
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
        // for (let i = 0; i < 4; i++) {
        //     let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
        //     BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        // }
    }
}