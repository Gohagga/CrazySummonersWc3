import { SpellEvent } from "Global/SpellEvent";
import { Unit } from "w3ts/index";
import { ElementalistMastery } from "Classes/ElementalistMastery";

export class ElementMastery {
    public static SpellId: number;
    
    static init(spellId: number) {
        this.SpellId = spellId;
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            let mastery = ElementalistMastery.Get(caster);
            mastery.AddBonusExperience(4 + level);
        });
    }
}