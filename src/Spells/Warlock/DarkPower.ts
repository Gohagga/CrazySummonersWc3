import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { Spells, Items } from "Config";

export class DarkPower {
    private static _instance: Record<number, timer> = {};
    public static SpellId: number;

    public static StartChargeUp(caster: unit, item: item) {
        let id = GetHandleId(caster);
        let tim = this._instance[id];
        if (id in this._instance == false) {
            tim = CreateTimer();
            this._instance[id] = tim;
        } else {
            PauseTimer(tim);
        }

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
        SpellEvent.RegisterSpellEffect(Spells.DarkFocusRedChoice, () => {
            const caster = GetTriggerUnit();
            let item = UnitItemInSlot(caster, 0);
            let charges = GetItemCharges(item);
            RemoveItem(item);
            UnitAddItemToSlotById(caster, Items.DarkFocusPurpleRed, 0);
            item = UnitItemInSlot(caster, 0);
            SetItemCharges(item, charges);
            this.StartChargeUp(caster, item);
        });
        SpellEvent.RegisterSpellEffect(Spells.DarkFocusBlueChoice, () => {
            const caster = GetTriggerUnit();
            let item = UnitItemInSlot(caster, 0);
            let charges = GetItemCharges(item);
            RemoveItem(item);
            UnitAddItemToSlotById(caster, Items.DarkFocusPurpleBlue, 0);
            item = UnitItemInSlot(caster, 0);
            SetItemCharges(item, charges);
            this.StartChargeUp(caster, item);
        });
        SpellEvent.RegisterSpellEffect(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            let item = UnitItemInSlot(caster, 0);
            let itemId = GetItemTypeId(item);
            let orbType = OrbType.Purple;
            let seconds = GetItemCharges(item);
            SetItemCharges(item, 0);

            if (itemId == Items.DarkFocusBase) {
                orbType = OrbType.Purple;
                this.StartChargeUp(caster, item);

            } else if (itemId == Items.DarkFocusBlue) {
                orbType = OrbType.Blue;
                // UnitRemoveItem(caster, item);
                RemoveItem(item);
                UnitAddItemToSlotById(caster, Items.DarkFocusPurpleBlue, 0);
                item = UnitItemInSlot(caster, 0);
                this.StartChargeUp(caster, item);

            } else if (itemId == Items.DarkFocusRed) {
                orbType = OrbType.Red;
                RemoveItem(item);
                UnitAddItemToSlotById(caster, Items.DarkFocusPurpleRed, 0);
                item = UnitItemInSlot(caster, 0);
                this.StartChargeUp(caster, item);

            } else if (itemId == Items.DarkFocusPurpleBlue) {
                orbType = OrbType.Purple;
                RemoveItem(item);
                UnitAddItemToSlotById(caster, Items.DarkFocusBlue, 0);
                item = UnitItemInSlot(caster, 0);
                this.StartChargeUp(caster, item);

            } else if (itemId == Items.DarkFocusPurpleRed) {
                orbType = OrbType.Purple;
                RemoveItem(item);
                UnitAddItemToSlotById(caster, Items.DarkFocusRed, 0);
                item = UnitItemInSlot(caster, 0);
                this.StartChargeUp(caster, item);
            } else {
                seconds = 15;
            }

            // Reset that much seconds
            let bar = ResourceBar.Get(owner);
            let orbs = bar.Orbs;
            for (let i = orbs.length - 1; i >= 0; i--) {
                let o = orbs[i];
                if (o.type == orbType && o.isAvailable == false) {
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