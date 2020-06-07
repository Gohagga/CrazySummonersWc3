import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Dummies, Models } from "Config";

export class Invigorate {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Invigorate;
    public static readonly DummyOrder = "roar";
    public static readonly Sfx: string = "Radiance Holy.mdl";
    public static CastSfx = Models.CastRestoration;

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                aoe: [ 200, 200, 350, 500 ][level - 1],
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: [ 2.0, 2.0, 1.5, 1.2 ][level - 1],
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.White,
                    OrbType.White,
                    OrbType.Blue
                ])) return;

                SpellHelper.DummyCastImmediate(owner, x, y, this.DummySpellId, level, this.DummyOrder);

                // Remove effects from necessary targets
                // GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                // let u = FirstOfGroup(SpellGroup);
                // while (u != null) {
                //     GroupRemoveUnit(SpellGroup, u);
                //     SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
                //     u = FirstOfGroup(SpellGroup);
                // }
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