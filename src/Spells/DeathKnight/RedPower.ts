import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { Items } from "Config";

export class RedPower {
    private static _instance: Record<number, timer> = {};
    public static SpellId: number;

    public static StartChargeUp(item: item) {
        let id = GetHandleId(item);
        let tim = this._instance[id];
        if (id in this._instance == false) {
            tim = CreateTimer();
            this._instance[id] = tim;
        } else {
            PauseTimer(tim);
        }
        SetItemCharges(item, 5);

        TimerStart(tim, 1, true, () => {
            let charges = GetItemCharges(item);
            if (charges < 30) {
                SetItemCharges(item, charges + 1);
            } else {
                PauseTimer(tim);
            }
        });
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        SpellEvent.RegisterSpellEffect(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            let index = GetInventoryIndexOfItemTypeBJ(caster, Items.RedPowerStacks);
            let seconds = 15;
            if (index > 0) {
                let item = UnitItemInSlot(caster, index - 1);
                seconds = GetItemCharges(item);
                // Start the charge up thing
                this.StartChargeUp(item);
            }
            // Reset that much seconds
            let bar = ResourceBar.Get(owner);
            let orbs = bar.Orbs;
            for (let i = orbs.length - 1; i >= 0; i--) {
                let o = orbs[i];
                if (o.type == OrbType.Red && o.isAvailable == false) {
                    if (seconds >= o.cooldownRemaining) {
                        seconds -= o.cooldownRemaining;
                        o.cooldownRemaining = 0;
                    } else if (seconds > 0) {
                        o.cooldownRemaining -= seconds;
                        seconds = -1;
                    } else {
                        break;
                    }
                }
            }
        });
    }
}