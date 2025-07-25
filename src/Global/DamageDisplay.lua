require("lualib_bundle");
local ____exports = {}
local ____HeroStats = require("Global.HeroStats")
local HeroStats = ____HeroStats.HeroStats
____exports.DamageDisplay = {}
local DamageDisplay = ____exports.DamageDisplay
DamageDisplay.name = "DamageDisplay"
DamageDisplay.____getters = {}
DamageDisplay.__index = DamageDisplay
DamageDisplay.prototype = {}
DamageDisplay.prototype.__index = DamageDisplay.prototype
DamageDisplay.prototype.constructor = DamageDisplay
setmetatable(DamageDisplay, {__index = __TS__ClassIndex})
function DamageDisplay.new(...)
    local self = setmetatable({}, DamageDisplay.prototype)
    self:____constructor(...)
    return self
end
function DamageDisplay.prototype.____constructor(self)
end
function DamageDisplay.____getters.EventDamagedAfterAmount(self)
    return self.DamagedAfterAmount or 0
end
function DamageDisplay.____getters.EventDamageWasCrit(self)
    return self.DamageWasCrit or false
end
function DamageDisplay.____getters.EventDamageWasBlocked(self)
    return self.DamageWasBlocked or false
end
function DamageDisplay.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED)
    TriggerAddAction(
        t,
        function()
            local damage = GetEventDamage()
            self.DamageWasCrit = false
            self.DamagedAfterAmount = nil
            if damage == 0 then
                return
            end
            local source = GetEventDamageSource()
            local target = BlzGetEventDamageTarget()
            local attackType = BlzGetEventAttackType()
            local damageType = BlzGetEventDamageType()
            local owner = GetOwningPlayer(source)
            local size = (damage / 60) * 3 + 8
            local multiplier = 1
            local rgb = {100, 100, 100}
            if attackType == ATTACK_TYPE_MELEE then
                rgb = {100, 100, 100}
            elseif attackType == ATTACK_TYPE_MELEE then
                rgb = {25, 50, 100}
            end
            local stats = HeroStats.new(source)
            multiplier = stats:CritChance()
            if multiplier > 1 then
                size = size * multiplier
                damage = damage * multiplier
                self.DamageWasCrit = true
                rgb[1] = 100
                rgb[2] = rgb[2] * 0.3
                rgb[3] = rgb[3] * 0.3
            end
            local dString = tostring(
                math.floor(damage)
            ) .. ""
            BlzSetEventDamage(damage)
            self.DamagedAfterAmount = damage
            CreateTextTagUnitBJ(dString, target, 50, size, rgb[1], rgb[2], rgb[3], 0)
            if owner == GetLocalPlayer() then
                SetTextTagVelocity(bj_lastCreatedTextTag, self.TTXVEL, self.TTYVEL)
                SetTextTagLifespan(bj_lastCreatedTextTag, 2.5)
                SetTextTagPermanent(bj_lastCreatedTextTag, false)
                SetTextTagFadepoint(bj_lastCreatedTextTag, 1.4)
            else
                SetTextTagVisibility(bj_lastCreatedTextTag, false)
            end
        end
    )
end
DamageDisplay.DamageWasCrit = false
DamageDisplay.DamageWasBlocked = false
DamageDisplay.TTXVEL = 0.083203125 * Cos(90 * bj_DEGTORAD)
DamageDisplay.TTYVEL = 0.083203125 * Sin(90 * bj_DEGTORAD)
return ____exports
