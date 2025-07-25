require("lualib_bundle");
local ____exports = {}
____exports.Interruptable = {}
local Interruptable = ____exports.Interruptable
Interruptable.name = "Interruptable"
Interruptable.__index = Interruptable
Interruptable.prototype = {}
Interruptable.prototype.__index = Interruptable.prototype
Interruptable.prototype.constructor = Interruptable
function Interruptable.new(...)
    local self = setmetatable({}, Interruptable.prototype)
    self:____constructor(...)
    return self
end
function Interruptable.prototype.____constructor(self)
end
function Interruptable.Register(self, unit, condition)
    local unitId = GetHandleId(unit)
    if not (____exports.Interruptable._instance[unitId] ~= nil) then
        ____exports.Interruptable._instance[unitId] = {}
    end
    __TS__ArrayPush(____exports.Interruptable._instance[unitId], condition)
end
function Interruptable.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_ORDER)
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    TriggerAddAction(
        t,
        function()
            local unit = GetTriggerUnit()
            local unitId = GetHandleId(unit)
            if not (self._instance[unitId] ~= nil) then
                return
            end
            local instance = self._instance[unitId]
            local remaining = {}
            local order = GetIssuedOrderId()
            if #instance > 0 then
                if string.sub(
                    (tostring(order) .. ""),
                    1,
                    0 + 6
                ) == "109367" then
                    return
                end
            end
            do
                local i = 0
                while i < #instance do
                    if instance[i + 1](
                        GetIssuedOrderId()
                    ) then
                        __TS__ArrayPush(remaining, instance[i + 1])
                    end
                    i = i + 1
                end
            end
            self._instance[unitId] = remaining
        end
    )
end
Interruptable._instance = {}
return ____exports
