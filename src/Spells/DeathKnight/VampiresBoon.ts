import { Auras, Models, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString, OrbType } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";

export class VampiresBoon {
    public static SpellId: number;
    public static CastSfx = Models.CastSacrifice;
    public static Aura = Auras.VampiresBoon;
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
            OrbType.Red,
            OrbType.Red,
            OrbType.Purple,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetRectCenterX(gg_rct_Battleground);
            const y = GetRectCenterY(gg_rct_Battleground);
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let might = math.fmod((level - 1), 4);
            let will = math.floor((level-1) / 4);

            // print(might);

            let data = {
                done: false,

                duration: 6.0 + 2.0 * will,
                auraLevel: might + 1,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 2.5,
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                let dummy = CreateUnit(owner, Units.NegativeZDummy, x, y, 0);
                UnitAddAbility(dummy, this.Aura);
                SetUnitAbilityLevel(dummy, this.Aura, data.auraLevel);
                UnitApplyTimedLife(dummy, FourCC('B000'), data.duration);
                SetUnitScale(dummy, 10, 10, 1);

            });
            Interruptable.Register(caster, () => {

                if (data.done == false) {
                    DestroyEffect(data.castSfx);
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