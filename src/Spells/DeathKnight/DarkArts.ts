import { SpellEvent } from "Global/SpellEvent";
import { Spells, Items, Units } from "Config";
import { DarkArtBloodReq, DarkArtUnholyReq, DarkArtNecromancyReq } from "Modules/Globals";

type ReqUnits = {
    blood: unit,
    unholy: unit,
    necromancy: unit
};

export class DarkArts {
    public static SpellId: number;
    public static BookId = Items.DeathKnightDarkArts;

    public static instance: Record<number, ReqUnits> = {};

    static Initialize(unit: unit) {

        const owner = GetOwningPlayer(unit);
        const ownerId = GetPlayerId(owner);
        // let instance = DarkArts.instance[GetPlayerId(owner)] || {};

        let instance: ReqUnits;
        if (ownerId in DarkArts.instance) {
            instance = DarkArts.instance[ownerId];
            RemoveUnit(instance.blood);
            RemoveUnit(instance.unholy);
            RemoveUnit(instance.necromancy);
            DarkArtBloodReq.Decrease(owner, DarkArtBloodReq.Get(owner));
            DarkArtUnholyReq.Decrease(owner, DarkArtUnholyReq.Get(owner));
            DarkArtNecromancyReq.Decrease(owner, DarkArtNecromancyReq.Get(owner));
        }
        instance = {
            blood: CreateUnit(owner, Units.DarkArtBloodUnlocked, 0, 0, 0),
            unholy: CreateUnit(owner, Units.DarkArtUnholyUnlocked, 0, 0, 0),
            necromancy: CreateUnit(owner, Units.DarkArtNecromancyUnlocked, 0, 0, 0)
        }
        DarkArts.instance[ownerId] = instance;
    }

    static init() {
        let x = 0;
        SpellEvent.RegisterSpellEnd(Spells.DarkArtBlood, () => {
            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);

            const lvl = DarkArtBloodReq.Get(owner);
            if (lvl > 0) return;

            let index = GetInventoryIndexOfItemTypeBJ(caster, DarkArts.BookId) - 1;
            if (index == -1) return;
            RemoveItem(UnitItemInSlot(caster, index));
            DarkArtBloodReq.Decrease(owner, lvl);
            DarkArtBloodReq.Increase(owner);
            RemoveUnit(DarkArts.instance[GetPlayerId(owner)].blood)
        });
        SpellEvent.RegisterSpellEnd(Spells.DarkArtUnholy, () => {
            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);

            const lvl = DarkArtUnholyReq.Get(owner);
            if (lvl > 0) return;

            let index = GetInventoryIndexOfItemTypeBJ(caster, DarkArts.BookId) - 1;
            if (index == -1) return;
            RemoveItem(UnitItemInSlot(caster, index));
            DarkArtUnholyReq.Decrease(owner, lvl);
            DarkArtUnholyReq.Increase(owner);
            RemoveUnit(DarkArts.instance[GetPlayerId(owner)].unholy)
        });
        SpellEvent.RegisterSpellEnd(Spells.DarkArtNecromancy, () => {
            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            
            const lvl = DarkArtNecromancyReq.Get(owner);
            if (lvl > 0) return;

            let index = GetInventoryIndexOfItemTypeBJ(caster, DarkArts.BookId) - 1;
            if (index == -1) return;
            RemoveItem(UnitItemInSlot(caster, index));
            DarkArtNecromancyReq.Decrease(owner, lvl);
            DarkArtNecromancyReq.Increase(owner);
            RemoveUnit(DarkArts.instance[GetPlayerId(owner)].necromancy)
        });
    }
}