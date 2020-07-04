import { SpellEvent } from "Global/SpellEvent";
import { Unit } from "w3ts/index";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";
import { Tooltips, Dummies } from "Config";
import { SpellHelper } from "Global/SpellHelper";

export class ElementMastery {
    public static SpellId: number;

    private static Data(context: Record<string, any>) {
        let { level } = context as { level: number };
        return {
            amount: 4 + level
        }
    }
    
    static init(spellId: number) {
        this.SpellId = spellId;
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            let data = this.Data({level});
            let mastery = ElementalistMastery.Get(caster);
            mastery.AddBonusExperience(data.amount);
            SpellHelper.DummyCastTarget(owner.handle, caster.x, caster.y, caster.handle, Dummies.ElementalMastery, 1, "innerfire");
        });

        for (let i = 0; i < 7; i++) {
            let data = this.Data({ level: i+1 }) as Record<string, any>;
            let tooltip = TextRenderer.Render(Tooltips.ElementalMastery, data);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}