require("lualib_bundle");
local ____exports = {}
____exports.SpellGroup = CreateGroup()
____exports.TempGroup = CreateGroup()
require("Config")
____exports.SpellHelper = {}
local SpellHelper = ____exports.SpellHelper
SpellHelper.name = "SpellHelper"
SpellHelper.____getters = {}
SpellHelper.__index = SpellHelper
SpellHelper.prototype = {}
SpellHelper.prototype.__index = SpellHelper.prototype
SpellHelper.prototype.constructor = SpellHelper
setmetatable(SpellHelper, {__index = __TS__ClassIndex})
function SpellHelper.new(...)
    local self = setmetatable({}, SpellHelper.prototype)
    self:____constructor(...)
    return self
end
function SpellHelper.prototype.____constructor(self)
end
function SpellHelper.____getters.UnitAliveFilter(self)
    return self.filters.unitAliveFilter
end
function SpellHelper.DummyCastTarget(self, player, x, y, target, spellId, spellLevel, order)
    local dummy = CreateUnit(player, Units.DUMMY, x, y, 0)
    SetUnitX(dummy, x)
    SetUnitY(dummy, y)
    UnitAddAbility(dummy, spellId)
    SetUnitAbilityLevel(dummy, spellId, spellLevel)
    IssueTargetOrder(dummy, order, target)
    UnitApplyTimedLife(
        dummy,
        FourCC("B000"),
        2
    )
    return dummy
end
function SpellHelper.DummyCastPoint(self, player, x, y, tx, ty, spellId, spellLevel, order)
    local dummy = CreateUnit(player, Units.DUMMY, x, y, 0)
    SetUnitX(dummy, x)
    SetUnitY(dummy, y)
    UnitAddAbility(dummy, spellId)
    SetUnitAbilityLevel(dummy, spellId, spellLevel)
    IssuePointOrder(dummy, order, tx, ty)
    UnitApplyTimedLife(
        dummy,
        FourCC("B000"),
        0.5
    )
    return dummy
end
function SpellHelper.DummyCastImmediate(self, player, x, y, spellId, spellLevel, order)
    local dummy = CreateUnit(player, Units.DUMMY, x, y, 0)
    SetUnitX(dummy, x)
    SetUnitY(dummy, y)
    UnitAddAbility(dummy, spellId)
    SetUnitAbilityLevel(dummy, spellId, spellLevel)
    IssueImmediateOrder(dummy, order)
    UnitApplyTimedLife(
        dummy,
        FourCC("B000"),
        0.5
    )
    return dummy
end
function SpellHelper.TableEnumUnitsInRange(self, x, y, radius, filter)
    local tab = {}
    GroupEnumUnitsInRange(____exports.SpellGroup, x, y, radius, filter)
    local u = FirstOfGroup(____exports.SpellGroup)
    while u ~= nil do
        GroupRemoveUnit(____exports.SpellGroup, u)
        __TS__ArrayPush(tab, u)
        u = FirstOfGroup(____exports.SpellGroup)
    end
    return tab
end
function SpellHelper.CopyGroup(self, g)
    bj_groupAddGroupDest = CreateGroup()
    ForGroup(g, GroupAddGroupEnum)
    return bj_groupAddGroupDest
end
function SpellHelper.Preload(self, spellId)
    __TS__ArrayPush(self.spellsToPreload, spellId)
end
function SpellHelper.ExecuteSpellPreload(self)
    local dummy = CreateUnit(
        Player(PLAYER_NEUTRAL_PASSIVE),
        Units.DUMMY,
        0,
        0,
        0
    )
    for ____, id in ipairs(self.spellsToPreload) do
        UnitAddAbility(dummy, id)
    end
    KillUnit(dummy)
end
SpellHelper.filters = {
    unitAliveFilter = Condition(
        function() return GetWidgetLife(
            GetFilterUnit()
        ) > 0.405 end
    )
}
SpellHelper.spellsToPreload = {}
return ____exports
