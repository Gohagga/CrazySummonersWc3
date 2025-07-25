require("lualib_bundle");
local ____exports = {}
____exports.UnitConfigurable = {}
local UnitConfigurable = ____exports.UnitConfigurable
UnitConfigurable.name = "UnitConfigurable"
UnitConfigurable.__index = UnitConfigurable
UnitConfigurable.prototype = {}
UnitConfigurable.prototype.__index = UnitConfigurable.prototype
UnitConfigurable.prototype.constructor = UnitConfigurable
function UnitConfigurable.new(...)
    local self = setmetatable({}, UnitConfigurable.prototype)
    self:____constructor(...)
    return self
end
function UnitConfigurable.prototype.____constructor(self)
end
function UnitConfigurable.GetUnitConfig(self, unit)
    local unitId = GetHandleId(unit)
    if self._config[unitId] ~= nil then
        return self._config[unitId]
    end
    return self._defaultConfig
end
function UnitConfigurable.UpdateUnitConfig(self, unit, cb)
    local unitId = GetHandleId(unit)
    local config
    if not (self._config[unitId] ~= nil) then
        config = __TS__ObjectAssign({}, self._defaultConfig)
    else
        config = self._config[unitId]
    end
    self._config[unitId] = config
    cb(self._config[unitId])
end
function UnitConfigurable.SetDefaultConfig(self, data)
    self._defaultConfig = data
    local record = {}
    self._config = record
end
return ____exports
