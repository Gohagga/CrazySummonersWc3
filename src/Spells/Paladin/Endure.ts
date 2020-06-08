import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Dummies, Models } from "Config";

export class Endure {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Endure;
    public static readonly DummyOrder = "frostarmor";
    public static readonly Sfx: string = "Abilities\\Spells\\NightElf\\Taunt\\TauntCaster.mdl";
    public static CastSfx = Models.CastDetermination;

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                aoe: [ 250, 250, 400, 550 ][level - 1],
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: [ 2, 1, 1, 1 ][level - 1],
            }
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.White,
                    OrbType.White,
                    OrbType.Purple
                ])) return;

                let sfx = AddSpecialEffect(this.Sfx, x, y);
                BlzSetSpecialEffectScale(sfx, 0.0045 * data.aoe);
                DestroyEffect(sfx);

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
                    u = FirstOfGroup(SpellGroup);
                }
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