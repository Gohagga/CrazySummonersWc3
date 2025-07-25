local ____exports = {}
____exports.TriggeredMissile = {}
local TriggeredMissile = ____exports.TriggeredMissile
TriggeredMissile.name = "TriggeredMissile"
TriggeredMissile.__index = TriggeredMissile
TriggeredMissile.prototype = {}
TriggeredMissile.prototype.__index = TriggeredMissile.prototype
TriggeredMissile.prototype.constructor = TriggeredMissile
function TriggeredMissile.new(...)
    local self = setmetatable({}, TriggeredMissile.prototype)
    self:____constructor(...)
    return self
end
function TriggeredMissile.prototype.____constructor(self, caster, spellId, orderId, level)
    self.doCallback = function() return nil end
    self.caster = caster
    self.level = level
    self.spellId = spellId
    self.orderId = orderId
end
function TriggeredMissile.prototype.CastAtTargetAndDo(self, target, doCallback)
    local owner = GetOwningPlayer(self.caster)
    local dummy = CreateUnit(
        owner,
        ____exports.TriggeredMissile.DummyId,
        GetUnitX(self.caster),
        GetUnitY(self.caster),
        0
    )
    UnitAddAbility(dummy, self.spellId)
    SetUnitAbilityLevel(dummy, self.spellId, self.level)
    ____exports.TriggeredMissile._missileData[GetHandleId(dummy)] = self
    self.doCallback = doCallback
    IssueTargetOrderById(dummy, self.orderId, target)
end
function TriggeredMissile.init(self, dummyId)
    self.DummyId = dummyId
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED)
    TriggerAddAction(
        t,
        function()
            local sourceId = GetHandleId(
                GetEventDamageSource()
            )
            if ____exports.TriggeredMissile._missileData[sourceId] ~= nil then
                local data = ____exports.TriggeredMissile._missileData[sourceId]
                data.doCallback(data)
                ____exports.TriggeredMissile._missileData[sourceId] = nil
            end
        end
    )
end
TriggeredMissile._missileData = {}
return ____exports
