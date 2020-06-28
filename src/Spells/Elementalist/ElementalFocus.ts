import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Items, Log } from "Config";
import { Unit } from "w3ts/index";
import { Orb } from "Systems/OrbResource/Orb";

export class ElementalFocus {

    static init(spellId: number, type: OrbType) {

        let orbType = type;
        let spell = spellId;
        SpellEvent.RegisterSpellEffect(spell, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            let level = caster.getAbilityLevel(spellId);
            
            Log.info(GetObjectName(spell),"cast");
            let maxSeconds = 10 + 5 * level;

            Log.info(1);
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
            if (seconds > maxSeconds) seconds = maxSeconds;

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
            Log.info(5);
        });
    }
}