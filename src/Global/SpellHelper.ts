import { Units } from "Config";
import { Point, Unit } from "w3ts/index";

export const SpellGroup = CreateGroup();
export const TempGroup = CreateGroup();



export class SpellHelper {
    private static filters = {
        unitAliveFilter: Condition(() => GetWidgetLife(GetFilterUnit()) > 0.405)
    }

    public static get UnitAliveFilter() {
        return this.filters.unitAliveFilter;
    }

    public static DummyCastTarget(player: player, x: number, y: number, target: unit, spellId: number, spellLevel: number, order: string) {
        let dummy = CreateUnit(player, Units.DUMMY, x, y, 0.0);
        SetUnitX(dummy, x);
        SetUnitY(dummy, y);
        UnitAddAbility(dummy, spellId);
        SetUnitAbilityLevel(dummy, spellId, spellLevel);
        IssueTargetOrder(dummy, order, target);
        UnitApplyTimedLife(dummy, FourCC('B000'), 2);
        return dummy
    }

    public static DummyCastPoint(player: player, x: number, y: number, tx: number, ty: number, spellId: number, spellLevel: number, order: string) {
        let dummy = CreateUnit(player, Units.DUMMY, x, y, 0.0);
        SetUnitX(dummy, x);
        SetUnitY(dummy, y);
        UnitAddAbility(dummy, spellId);
        SetUnitAbilityLevel(dummy, spellId, spellLevel);
        IssuePointOrder(dummy, order, tx, ty);
        UnitApplyTimedLife(dummy, FourCC('B000'), 0.5);
        return dummy
    }

    public static DummyCastImmediate(player: player, x: number, y: number, spellId: number, spellLevel: number, order: string) {
        let dummy = CreateUnit(player, Units.DUMMY, x, y, 0.0);
        SetUnitX(dummy, x);
        SetUnitY(dummy, y);
        UnitAddAbility(dummy, spellId);
        SetUnitAbilityLevel(dummy, spellId, spellLevel);
        IssueImmediateOrder(dummy, order);
        UnitApplyTimedLife(dummy, FourCC('B000'), 0.5);
        return dummy
    }

    public static TableEnumUnitsInRange(x: number, y: number, radius: number, filter: boolexpr) {
        let tab = [];
        GroupEnumUnitsInRange(SpellGroup, x, y, radius, filter)

        let u = FirstOfGroup(SpellGroup)
        while (u != null) {
            GroupRemoveUnit(SpellGroup, u);
            tab.push(u);
            u = FirstOfGroup(SpellGroup)
        }
        return tab
    }

    public static EnumUnitsInRange(origin: Point, radius: number, filter?: (target: Unit, caster?: Unit) => boolean, source?: Unit): Unit[] {
        GroupEnumUnitsInRange(SpellGroup, origin.x, origin.y, radius, null);
        const units: Unit[] = [];
        let u: unit;
        while ((u = FirstOfGroup(SpellGroup)) != null) {
            GroupRemoveUnit(SpellGroup, u);
            let U = Unit.fromHandle(u);
            if (!filter || filter(U, source)) {
                units.push(U);
            }
        }
        return units;
    }

    public static SortUnitsByValue(units: Unit[], valueFn: (u: Unit) => number): { unit: Unit, priority: number }[] {

        let choices: { unit: Unit, priority: number }[] = [];
        for (let u of units) {
            choices.push({
                unit: u,
                priority: valueFn(u)
            });
        }

        choices.sort((a, b) => a.priority - b.priority);
        return choices;
    }

    public static CopyGroup(g: group) {
        bj_groupAddGroupDest = CreateGroup();
        ForGroup(g, GroupAddGroupEnum);
        return bj_groupAddGroupDest;
    }

    private static spellsToPreload: number[] = [];
    public static Preload(spellId: number) {
        this.spellsToPreload.push(spellId);
    }

    public static ExecuteSpellPreload() {
        let dummy = CreateUnit(Player(PLAYER_NEUTRAL_PASSIVE), Units.DUMMY, 0, 0, 0);
        for (let id of this.spellsToPreload) {
            UnitAddAbility(dummy, id);
        }
        KillUnit(dummy);
    }
}