local ____exports = {}
____exports.LastTarget = {}
local LastTarget = ____exports.LastTarget
LastTarget.name = "LastTarget"
LastTarget.__index = LastTarget
LastTarget.prototype = {}
LastTarget.prototype.__index = LastTarget.prototype
LastTarget.prototype.constructor = LastTarget
function LastTarget.new(...)
    local self = setmetatable({}, LastTarget.prototype)
    self:____constructor(...)
    return self
end
function LastTarget.prototype.____constructor(self, condition)
    self.target = nil
    self.condition = condition
end
function LastTarget.Register(self, unit, condition)
    self._instance[GetHandleId(unit)] = ____exports.LastTarget.new(condition)
end
function LastTarget.Get(self, unit)
    return self._instance[GetHandleId(unit)].target
end
function LastTarget.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    TriggerAddAction(
        t,
        function()
            local unit = GetTriggerUnit()
            local unitId = GetHandleId(unit)
            if self._instance[unitId] ~= nil then
                local target = GetOrderTargetUnit()
                if target and self._instance[unitId].condition(unit, target) then
                    self._instance[unitId].target = target
                end
            end
        end
    )
end
LastTarget._instance = {}
return ____exports
