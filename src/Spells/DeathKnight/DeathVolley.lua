local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local OrbCostToString = ____Orb.OrbCostToString
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
local SpellGroup = ____SpellHelper.SpellGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
require("Config")
____exports.DeathVolley = {}
local DeathVolley = ____exports.DeathVolley
DeathVolley.name = "DeathVolley"
DeathVolley.__index = DeathVolley
DeathVolley.prototype = {}
DeathVolley.prototype.__index = DeathVolley.prototype
DeathVolley.prototype.constructor = DeathVolley
function DeathVolley.new(...)
    local self = setmetatable({}, DeathVolley.prototype)
    self:____constructor(...)
    return self
end
function DeathVolley.prototype.____constructor(self)
end
function DeathVolley.Filter(self, target)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_HERO) == false) and (GetWidgetLife(target) > 0.405)
end
function DeathVolley.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Red, OrbType.Purple, OrbType.Blue}
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
                aoe = 350 + 100 * level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "chest"),
                targetCount = 2 + level,
                castTime = 2
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2)
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
                    GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil and data.targetCount > 0 do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:Filter(u) then
                            local isUndead = UnitTypeFlags:IsUnitUndead(u)
                            if isUndead == false and IsUnitAlly(u, owner) == false then
                                SpellHelper:DummyCastTarget(
                                    owner,
                                    GetUnitX(caster),
                                    GetUnitY(caster),
                                    u,
                                    self.DummySpellId,
                                    level,
                                    self.DummyOrder
                                )
                            elseif isUndead and IsUnitAlly(u, owner) == true and GetWidgetLife(u) < GetUnitState(u, UNIT_STATE_MAX_LIFE) then
                                if GetUnitAbilityLevel(u, Buffs.CorruptedBlood) > 0 then
                                    SpellHelper:DummyCastTarget(
                                        owner,
                                        GetUnitX(caster),
                                        GetUnitY(caster),
                                        u,
                                        self.DummySpellId,
                                        5,
                                        self.DummyOrder
                                    )
                                else
                                    SpellHelper:DummyCastTarget(
                                        owner,
                                        GetUnitX(caster),
                                        GetUnitY(caster),
                                        u,
                                        self.DummySpellId,
                                        level + 5,
                                        self.DummyOrder
                                    )
                                end
                            else
                                data.targetCount = data.targetCount + 1
                            end
                            data.targetCount = data.targetCount - 1
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
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
DeathVolley.DummySpellId = Dummies.DeathVolley
DeathVolley.DummyOrder = "shadowstrike"
DeathVolley.Aura = Auras.AmzSpellImmunity
DeathVolley.BuffId = Buffs.AntimagicZone
DeathVolley.Sfx = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlCaster.mdl"
DeathVolley.CastSfx = Models.CastUnholy
DeathVolley.OrbCost = {}
return ____exports
