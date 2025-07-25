local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
require("Config")
____exports.WhitePower = {}
local WhitePower = ____exports.WhitePower
WhitePower.name = "WhitePower"
WhitePower.__index = WhitePower
WhitePower.prototype = {}
WhitePower.prototype.__index = WhitePower.prototype
WhitePower.prototype.constructor = WhitePower
function WhitePower.new(...)
    local self = setmetatable({}, WhitePower.prototype)
    self:____constructor(...)
    return self
end
function WhitePower.prototype.____constructor(self)
end
function WhitePower.StartChargeUp(self, item)
    local id = GetHandleId(item)
    local tim = self._instance[id]
    if self._instance[id] ~= nil == false then
        tim = CreateTimer()
        self._instance[id] = tim
    else
        PauseTimer(tim)
    end
    SetItemCharges(item, 5)
    TimerStart(
        tim,
        1,
        true,
        function()
            local charges = GetItemCharges(item)
            if charges < 30 then
                SetItemCharges(item, charges + 1)
            else
                PauseTimer(tim)
            end
        end
    )
end
function WhitePower.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellEffect(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local index = GetInventoryIndexOfItemTypeBJ(caster, Items.WhitePowerStacks)
            local seconds = 15
            if index > 0 then
                local item = UnitItemInSlot(caster, index - 1)
                seconds = GetItemCharges(item)
                self:StartChargeUp(item)
            end
            local bar = ResourceBar:Get(owner)
            local orbs = bar.Orbs
            do
                local i = #orbs - 1
                while i >= 0 do
                    local o = orbs[i + 1]
                    if o.type == OrbType.White and o.isAvailable == false then
                        if seconds >= o.cooldownRemaining then
                            seconds = seconds - o.cooldownRemaining
                            o.cooldownRemaining = 0
                        elseif seconds > 0 then
                            o.cooldownRemaining = o.cooldownRemaining - seconds
                            seconds = -1
                        else
                            break
                        end
                    end
                    i = i - 1
                end
            end
        end
    )
end
WhitePower._instance = {}
return ____exports
