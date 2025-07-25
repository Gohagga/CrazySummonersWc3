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
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
require("Config")
____exports.DeathAndDecay = {}
local DeathAndDecay = ____exports.DeathAndDecay
DeathAndDecay.name = "DeathAndDecay"
DeathAndDecay.__index = DeathAndDecay
DeathAndDecay.prototype = {}
DeathAndDecay.prototype.__index = DeathAndDecay.prototype
DeathAndDecay.prototype.constructor = DeathAndDecay
function DeathAndDecay.new(...)
    local self = setmetatable({}, DeathAndDecay.prototype)
    self:____constructor(...)
    return self
end
function DeathAndDecay.prototype.____constructor(self, damage, healing, owner, radius, level, x, y, duration)
    self.duration = 0
    self.timer = CreateTimer()
    self.x = x
    self.y = y
    self.radius = radius
    self.duration = duration
    self.damage = damage
    self.healing = healing
    self.dummyCaster = CreateUnit(owner, Units.DUMMY, 0, 0, 0)
    UnitAddAbility(self.dummyCaster, ____exports.DeathAndDecay.DummySpellId)
    SetUnitAbilityLevel(self.dummyCaster, ____exports.DeathAndDecay.DummySpellId, level)
    IssuePointOrder(self.dummyCaster, ____exports.DeathAndDecay.DummyOrder, self.x, self.y)
    UnitApplyTimedLife(
        self.dummyCaster,
        FourCC("B000"),
        duration
    )
end
function DeathAndDecay.prototype.Run(self)
    if not self.timer then
        self.timer = CreateTimer()
    end
    TimerStart(
        self.timer,
        1.5,
        true,
        function()
            GroupEnumUnitsInRange(SpellGroup, self.x, self.y, self.radius, nil)
            local u = FirstOfGroup(SpellGroup)
            while u ~= nil do
                GroupRemoveUnit(SpellGroup, u)
                if ____exports.DeathAndDecay:Filter(u) then
                    local isUndead = UnitTypeFlags:IsUnitUndead(u)
                    local maxHp = GetUnitState(u, UNIT_STATE_MAX_LIFE)
                    if isUndead == false then
                        UnitDamageTarget(self.dummyCaster, u, maxHp * self.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                        DestroyEffect(
                            AddSpecialEffectTarget(____exports.DeathAndDecay.DamageSfx, u, "origin")
                        )
                    else
                        SetWidgetLife(
                            u,
                            GetWidgetLife(u) + self.healing * maxHp
                        )
                        DestroyEffect(
                            AddSpecialEffectTarget(____exports.DeathAndDecay.HealSfx, u, "origin")
                        )
                    end
                end
                u = FirstOfGroup(SpellGroup)
            end
            if self.duration > 0 then
                self.duration = self.duration - 1.5
            else
                self:End()
            end
        end
    )
end
function DeathAndDecay.prototype.End(self)
    PauseTimer(self.timer)
    DestroyTimer(self.timer)
    RemoveUnit(self.dummyCaster)
end
function DeathAndDecay.Filter(self, target)
    return IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false and IsUnitType(target, UNIT_TYPE_STRUCTURE) == false and IsUnitType(target, UNIT_TYPE_MECHANICAL) == false and IsUnitType(target, UNIT_TYPE_HERO) == false and GetWidgetLife(target) > 0.405
end
function DeathAndDecay.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Purple, OrbType.Purple, OrbType.Blue}
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
                aoe = 200 + 100 * level,
                damage = 0.05,
                healing = 0.02,
                duration = 12 + 3 * level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 3.5
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
                    local amz = ____exports.DeathAndDecay.new(data.damage, data.healing, owner, data.aoe, level, x, y, data.duration)
                    amz:Run()
                end
            )
            Interruptable:Register(
                caster,
                function(orderId)
                    if data.done == false then
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
DeathAndDecay.DummySpellId = Dummies.DeathAndDecay
DeathAndDecay.DummyOrder = "deathanddecay"
DeathAndDecay.HealSfx = "Abilities\\Weapons\\SorceressMissile\\SorceressMissile.mdl"
DeathAndDecay.DamageSfx = "Abilities\\Spells\\Undead\\DeathandDecay\\DeathandDecayDamage.mdl"
DeathAndDecay.CastSfx = Models.CastShadow
DeathAndDecay.OrbCost = {}
return ____exports
