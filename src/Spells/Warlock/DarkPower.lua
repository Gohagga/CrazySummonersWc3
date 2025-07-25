local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
require("Config")
____exports.DarkPower = {}
local DarkPower = ____exports.DarkPower
DarkPower.name = "DarkPower"
DarkPower.__index = DarkPower
DarkPower.prototype = {}
DarkPower.prototype.__index = DarkPower.prototype
DarkPower.prototype.constructor = DarkPower
function DarkPower.new(...)
    local self = setmetatable({}, DarkPower.prototype)
    self:____constructor(...)
    return self
end
function DarkPower.prototype.____constructor(self)
end
function DarkPower.StartChargeUp(self, caster, item)
    local id = GetHandleId(caster)
    local tim = self._instance[id]
    if self._instance[id] ~= nil == false then
        tim = CreateTimer()
        self._instance[id] = tim
    else
        PauseTimer(tim)
    end
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
function DarkPower.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellEffect(
        Spells.DarkFocusRedChoice,
        function()
            local caster = GetTriggerUnit()
            local item = UnitItemInSlot(caster, 0)
            local charges = GetItemCharges(item)
            RemoveItem(item)
            UnitAddItemToSlotById(caster, Items.DarkFocusPurpleRed, 0)
            item = UnitItemInSlot(caster, 0)
            SetItemCharges(item, charges)
            self:StartChargeUp(caster, item)
        end
    )
    SpellEvent:RegisterSpellEffect(
        Spells.DarkFocusBlueChoice,
        function()
            local caster = GetTriggerUnit()
            local item = UnitItemInSlot(caster, 0)
            local charges = GetItemCharges(item)
            RemoveItem(item)
            UnitAddItemToSlotById(caster, Items.DarkFocusPurpleBlue, 0)
            item = UnitItemInSlot(caster, 0)
            SetItemCharges(item, charges)
            self:StartChargeUp(caster, item)
        end
    )
    SpellEvent:RegisterSpellEffect(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local item = UnitItemInSlot(caster, 0)
            local itemId = GetItemTypeId(item)
            local orbType = OrbType.Purple
            local seconds = GetItemCharges(item)
            SetItemCharges(item, 0)
            if itemId == Items.DarkFocusBase then
                orbType = OrbType.Purple
                self:StartChargeUp(caster, item)
            elseif itemId == Items.DarkFocusBlue then
                orbType = OrbType.Blue
                RemoveItem(item)
                UnitAddItemToSlotById(caster, Items.DarkFocusPurpleBlue, 0)
                item = UnitItemInSlot(caster, 0)
                self:StartChargeUp(caster, item)
            elseif itemId == Items.DarkFocusRed then
                orbType = OrbType.Red
                RemoveItem(item)
                UnitAddItemToSlotById(caster, Items.DarkFocusPurpleRed, 0)
                item = UnitItemInSlot(caster, 0)
                self:StartChargeUp(caster, item)
            elseif itemId == Items.DarkFocusPurpleBlue then
                orbType = OrbType.Purple
                RemoveItem(item)
                UnitAddItemToSlotById(caster, Items.DarkFocusBlue, 0)
                item = UnitItemInSlot(caster, 0)
                self:StartChargeUp(caster, item)
            elseif itemId == Items.DarkFocusPurpleRed then
                orbType = OrbType.Purple
                RemoveItem(item)
                UnitAddItemToSlotById(caster, Items.DarkFocusRed, 0)
                item = UnitItemInSlot(caster, 0)
                self:StartChargeUp(caster, item)
            else
                seconds = 15
            end
            local bar = ResourceBar:Get(owner)
            local orbs = bar.Orbs
            do
                local i = #orbs - 1
                while i >= 0 do
                    local o = orbs[i + 1]
                    if o.type == orbType and o.isAvailable == false then
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
DarkPower._instance = {}
return ____exports
