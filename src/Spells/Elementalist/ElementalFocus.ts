import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Items, Log, Tooltips } from "Config";
import { Unit } from "w3ts/index";
import { Orb } from "Systems/OrbResource/Orb";
import { TextRenderer } from "Global/TextRenderer";

export class ElementalFocus {

    private static Tooltip = Tooltips.ElementalFocus;

    private static Data(context: Record<string, any>) {
        let { level, type } = context as { level: number, type: string };
        return {
            type: { [OrbType.Red]: "Red", [OrbType.Blue]: "Blue", [OrbType.Purple]: "Purple" }[type],
            maxSeconds: 10 + 5 * level
        }
    }

    static init(spellId: number, type: OrbType) {

        let orbType = type;
        let spell = spellId;
        SpellEvent.RegisterSpellEffect(spell, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            let level = caster.getAbilityLevel(spellId);
            
            Log.info(GetObjectName(spell),"cast");
            let data = this.Data({level, type});

            // Find same type orbs, and highest cooldown one
            let orbs: Orb[] = [];
            let highestCd: Orb;

            // Reset that much seconds
            let bar = ResourceBar.Get(owner.handle);
            Log.info(bar.Orbs.length)

            for (let o of bar.Orbs) {

                if (o.type != OrbType.Summoning) {
                    orbs.push(o);
                }
                if (o.type == orbType &&
                    (!highestCd || o.cooldownRemaining > highestCd.cooldownRemaining)
                ) {
                    highestCd = o;
                }
            }

            if (!highestCd) return;

            Log.info(2);
            // Calculate time reduced
            let seconds = highestCd.cooldownRemaining;
            if (seconds > data.maxSeconds) seconds = data.maxSeconds;

            // Reduce highest cd
            highestCd.cooldownRemaining -= seconds;

            Log.info(3);
            // Split the cooldown across other orbs
            seconds = seconds / (orbs.length - 1);
            
            Log.info(4);
            // Increase or consume other orbs
            for (let o of orbs) {
                if (o == highestCd) continue;
                else if (o.isAvailable) o.Consume(owner.handle, seconds);
                else {
                    o.cooldownRemaining += seconds;
                }
            }
        });

        for (let i = 0; i < 4; i++) {
            let data = this.Data({level: i+1, type}) as Record<string, any>;
            let tooltip = TextRenderer.Render(this.Tooltip, data);
            BlzSetAbilityExtendedTooltip(spellId, tooltip, i);
        }
    }
}