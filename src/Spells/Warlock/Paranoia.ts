import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { UnitCharge } from "Systems/UnitCharge";
import { Dummies, Models } from "Config";

export class Paranoia {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Paranoia;
    public static readonly DummyOrder = "drunkenhaze";
    public static readonly Sfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlCaster.mdl";
    public static CastSfx = Models.CastShadow;

    public static Filter(target: unit, owner: player) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (IsUnitAlly(target, owner) == false) &&
            (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                aoe: 200 + 100 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: [ 3.0, 2.5, 2.0, 1.5 ][level - 1],
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Purple,
                    OrbType.Purple,
                    OrbType.Blue,
                ])) return;

                let sfx = AddSpecialEffect(this.Sfx, x, y);
                BlzSetSpecialEffectScale(sfx, 0.005 * data.aoe);
                DestroyEffect(sfx);

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (this.Filter(u, owner)) {
                        SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
                        let uc = UnitCharge.FromUnit(u)
                        IssuePointOrderLoc(u, "move", uc.origin);
                    }
                    SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
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