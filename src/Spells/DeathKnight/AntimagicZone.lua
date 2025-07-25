local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local OrbCostToString = ____Orb.OrbCostToString
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
local TempGroup = ____SpellHelper.TempGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.AntimagicZone = {}
local AntimagicZone = ____exports.AntimagicZone
AntimagicZone.name = "AntimagicZone"
AntimagicZone.__index = AntimagicZone
AntimagicZone.prototype = {}
AntimagicZone.prototype.__index = AntimagicZone.prototype
AntimagicZone.prototype.constructor = AntimagicZone
function AntimagicZone.new(...)
    local self = setmetatable({}, AntimagicZone.prototype)
    self:____constructor(...)
    return self
end
function AntimagicZone.prototype.____constructor(self, owner, radius, level, x, y, duration)
    self.units = CreateGroup()
    self.duration = 0
    self.timer = CreateTimer()
    self.x = x
    self.y = y
    self.radius = radius
    self.duration = duration
    self.sfx = AddSpecialEffect(____exports.AntimagicZone.Sfx, x, y)
    BlzSetSpecialEffectScale(self.sfx, 0.0033 * radius)
    self.silenceCaster = CreateUnit(owner, Units.DUMMY, 0, 0, 0)
    UnitAddAbility(self.silenceCaster, ____exports.AntimagicZone.DummySpellId)
    SetUnitAbilityLevel(self.silenceCaster, ____exports.AntimagicZone.DummySpellId, level)
    IssuePointOrder(self.silenceCaster, ____exports.AntimagicZone.DummyOrder, self.x, self.y)
    UnitApplyTimedLife(
        self.silenceCaster,
        FourCC("B000"),
        duration
    )
end
function AntimagicZone.prototype.Run(self)
    if not self.timer then
        self.timer = CreateTimer()
    end
    TimerStart(
        self.timer,
        0.25,
        true,
        function()
            GroupEnumUnitsInRange(SpellGroup, self.x, self.y, self.radius, nil)
            GroupClear(TempGroup)
            GroupAddGroup(self.units, TempGroup)
            local u = FirstOfGroup(TempGroup)
            while u ~= nil do
                GroupRemoveUnit(TempGroup, u)
                if ____exports.AntimagicZone:Filter(u) then
                    if GetUnitAbilityLevel(u, ____exports.AntimagicZone.BuffId) < 1 or IsUnitInGroup(u, SpellGroup) == false then
                        self:RemoveBuffs(u)
                    end
                end
                u = FirstOfGroup(TempGroup)
            end
            u = FirstOfGroup(SpellGroup)
            while u ~= nil do
                GroupRemoveUnit(SpellGroup, u)
                if ____exports.AntimagicZone:Filter(u) then
                    if IsUnitInGroup(u, self.units) == false then
                        self:AddBuffs(u)
                    end
                end
                u = FirstOfGroup(SpellGroup)
            end
            if self.duration > 0 then
                self.duration = self.duration - 0.25
            else
                self:End()
            end
        end
    )
end
function AntimagicZone.prototype.End(self)
    DestroyEffect(self.sfx)
    PauseTimer(self.timer)
    DestroyTimer(self.timer)
end
function AntimagicZone.prototype.AddBuffs(self, u)
    UnitAddAbility(u, ____exports.AntimagicZone.Aura)
    GroupAddUnit(self.units, u)
end
function AntimagicZone.prototype.RemoveBuffs(self, u)
    UnitRemoveAbility(u, ____exports.AntimagicZone.Aura)
    UnitRemoveAbility(u, ____exports.AntimagicZone.BuffId)
    GroupRemoveUnit(self.units, u)
end
function AntimagicZone.Filter(self, target)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (GetWidgetLife(target) > 0.405)
end
function AntimagicZone.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Blue, OrbType.Blue}
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetSpellTargetX()
            local y = GetSpellTargetY()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local data = {
                done = false,
                aoe = 250 + 50 * level,
                duration = 5 + 5 * level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 2.5
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume(self.OrbCost) then
                        return
                    end
                    local amz = ____exports.AntimagicZone.new(owner, data.aoe, level, x, y, data.duration)
                    amz:Run()
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if not data.done then
                        DestroyEffect(data.castSfx)
                        cb:Destroy()
                        data.done = true
                    end
                    return false
                end
            )
        end
    )
    do
        local i = 0
        while i < 4 do
            local tooltip = tostring(
                OrbCostToString(self.OrbCost)
            ) .. "|n|n" .. tostring(
                BlzGetAbilityExtendedTooltip(self.SpellId, i)
            )
            BlzSetAbilityExtendedTooltip(self.SpellId, tooltip, i)
            i = i + 1
        end
    end
end
AntimagicZone.DummySpellId = Dummies.AntimagicZone
AntimagicZone.DummyOrder = "cloudoffog"
AntimagicZone.Aura = Auras.AmzSpellImmunity
AntimagicZone.BuffId = Buffs.AntimagicZone
AntimagicZone.Sfx = Models.ForceField
AntimagicZone.CastSfx = Models.CastUnholy
AntimagicZone.OrbCost = {}
return ____exports
