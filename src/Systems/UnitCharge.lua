require("lualib_bundle");
local ____exports = {}
local ____GamePlayer = require("Systems.GamePlayer")
local GamePlayer = ____GamePlayer.GamePlayer
____exports.UnitCharge = {}
local UnitCharge = ____exports.UnitCharge
UnitCharge.name = "UnitCharge"
UnitCharge.__index = UnitCharge
UnitCharge.prototype = {}
UnitCharge.prototype.__index = UnitCharge.prototype
UnitCharge.prototype.constructor = UnitCharge
function UnitCharge.new(...)
    local self = setmetatable({}, UnitCharge.prototype)
    self:____constructor(...)
    return self
end
function UnitCharge.prototype.____constructor(self, unit, action, destination, origin)
    self.destination = destination
    self.origin = origin
    self.unit = unit
    self.action = function(____, uch) return action(uch) end
end
function UnitCharge.Register(self, unit, action, spawn)
    local uc = ____exports.UnitCharge.new(unit, action, spawn.Destination, spawn.Point)
    self._instance[GetHandleId(unit)] = uc
    __TS__ArrayPush(self.chargingUnits, uc.unit)
end
function UnitCharge.Reregister(self, unit, handleId)
    if self._instance[handleId] ~= nil then
        self._instance[handleId].unit = unit
    end
end
function UnitCharge.FromUnit(self, unit)
    return self._instance[GetHandleId(unit)]
end
function UnitCharge.Unregister(self, unit)
    self._instance[GetHandleId(unit)] = nil
end
function UnitCharge.init(self)
    local tim = CreateTimer()
    TimerStart(
        tim,
        0,
        false,
        function()
            PauseTimer(tim)
            DestroyTimer(tim)
            local tRed = CreateTrigger()
            local tBlue = CreateTrigger()
            TriggerRegisterEnterRectSimple(tRed, gg_rct_Blue_Damage_Line)
            TriggerRegisterEnterRectSimple(tBlue, gg_rct_Red_Damage_Line)
            TriggerAddAction(
                tRed,
                function()
                    local u = GetTriggerUnit()
                    local ownerId = GetPlayerId(
                        GetOwningPlayer(u)
                    )
                    local teamId = 1
                    if IsUnitType(u, UNIT_TYPE_HERO) == true or GetUnitTypeId(u) == Units.DUMMY or ownerId ~= 5 or GetUnitAbilityLevel(u, Auras.LanePersistance) > 0 then
                        return
                    end
                    if GetUnitAbilityLevel(u, Auras.LaneDrainImmunity) < 1 then
                        do
                            local i = 0
                            while i < 8 do
                                if GamePlayer.Team[i] == 2 then
                                    SetWidgetLife(
                                        GamePlayer.Hero[i],
                                        GetWidgetLife(GamePlayer.Hero[i]) - 1
                                    )
                                end
                                i = i + 1
                            end
                        end
                    end
                    RemoveUnit(u)
                end
            )
            TriggerAddAction(
                tBlue,
                function()
                    local u = GetTriggerUnit()
                    local ownerId = GetPlayerId(
                        GetOwningPlayer(u)
                    )
                    local teamId = 2
                    if IsUnitType(u, UNIT_TYPE_HERO) == true or GetUnitTypeId(u) == Units.DUMMY or ownerId ~= 9 or GetUnitAbilityLevel(u, Auras.LanePersistance) > 0 then
                        return
                    end
                    if GetUnitAbilityLevel(u, Auras.LaneDrainImmunity) < 1 then
                        do
                            local i = 0
                            while i < 8 do
                                if GamePlayer.Team[i] == 1 then
                                    SetWidgetLife(
                                        GamePlayer.Hero[i],
                                        GetWidgetLife(GamePlayer.Hero[i]) - 1
                                    )
                                end
                                i = i + 1
                            end
                        end
                    end
                    RemoveUnit(u)
                end
            )
        end
    )
    local chargeTimer = CreateTimer()
    TimerStart(
        chargeTimer,
        1,
        true,
        function()
            local n = {}
            do
                local i = 0
                while i < #self.chargingUnits do
                    local unit = self.chargingUnits[i + 1]
                    if not unit then
                        self._instance[GetHandleId(unit)] = nil
                        break
                    end
                    local uc = self._instance[GetHandleId(unit)]
                    uc:action(uc)
                    __TS__ArrayPush(n, unit)
                    i = i + 1
                end
            end
            self.chargingUnits = n
        end
    )
end
UnitCharge._instance = {}
UnitCharge.chargingUnits = {}
return ____exports
