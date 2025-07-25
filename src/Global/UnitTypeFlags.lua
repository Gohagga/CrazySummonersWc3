local ____exports = {}
require("Config")
____exports.UnitTypeFlags = {}
local UnitTypeFlags = ____exports.UnitTypeFlags
UnitTypeFlags.name = "UnitTypeFlags"
UnitTypeFlags.__index = UnitTypeFlags
UnitTypeFlags.prototype = {}
UnitTypeFlags.prototype.__index = UnitTypeFlags.prototype
UnitTypeFlags.prototype.constructor = UnitTypeFlags
function UnitTypeFlags.new(...)
    local self = setmetatable({}, UnitTypeFlags.prototype)
    self:____constructor(...)
    return self
end
function UnitTypeFlags.prototype.____constructor(self)
end
function UnitTypeFlags.IsUnitUndead(self, unit)
    return ____exports.UnitTypeFlags.Undead[GetUnitTypeId(unit)] or false
end
function UnitTypeFlags.IsUnitDemon(self, unit)
    return ____exports.UnitTypeFlags.Demon[GetUnitTypeId(unit)] or false
end
function UnitTypeFlags.IsUnitHuman(self, unit)
    return ____exports.UnitTypeFlags.Human[GetUnitTypeId(unit)] or false
end
function UnitTypeFlags.IsUnitHorror(self, unit)
    return ____exports.UnitTypeFlags.Horror[GetUnitTypeId(unit)] or false
end
function UnitTypeFlags.IsUnitElemental(self, unit)
    return ____exports.UnitTypeFlags.Elemental[GetUnitTypeId(unit)] or false
end
function UnitTypeFlags.init(self)
    for ____, id in ipairs(SpawnedUnitTypes.Undead) do
        ____exports.UnitTypeFlags.Undead[id] = true
    end
    for ____, id in ipairs(SpawnedUnitTypes.Demon) do
        ____exports.UnitTypeFlags.Demon[id] = true
    end
    for ____, id in ipairs(SpawnedUnitTypes.Horror) do
        ____exports.UnitTypeFlags.Horror[id] = true
    end
    for ____, id in ipairs(SpawnedUnitTypes.Human) do
        ____exports.UnitTypeFlags.Human[id] = true
    end
end
UnitTypeFlags.Undead = {}
UnitTypeFlags.Demon = {}
UnitTypeFlags.Human = {}
UnitTypeFlags.Elemental = {}
UnitTypeFlags.Horror = {}
return ____exports
