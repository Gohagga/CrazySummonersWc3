local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.GuardianAngel = {}
local GuardianAngel = ____exports.GuardianAngel
GuardianAngel.name = "GuardianAngel"
GuardianAngel.__index = GuardianAngel
GuardianAngel.prototype = {}
GuardianAngel.prototype.__index = GuardianAngel.prototype
GuardianAngel.prototype.constructor = GuardianAngel
function GuardianAngel.new(...)
    local self = setmetatable({}, GuardianAngel.prototype)
    self:____constructor(...)
    return self
end
function GuardianAngel.prototype.____constructor(self)
end
function GuardianAngel.Filter(self, target, owner)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and IsUnitAlly(target, owner) and (GetWidgetLife(target) > 0.405)
end
function GuardianAngel.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.White, OrbType.White, OrbType.Blue, OrbType.Purple}
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetRectCenterX(gg_rct_Battleground)
            local y = GetRectCenterY(gg_rct_Battleground)
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local data = {
                duration = 3.5 + 1.5 * level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 4 - 0.75 * level
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
                    local dummy = CreateUnit(owner, Units.NegativeZDummy, x, y, 0)
                    UnitAddAbility(dummy, self.Aura)
                    UnitApplyTimedLife(
                        dummy,
                        FourCC("B000"),
                        data.duration
                    )
                    SetUnitScale(dummy, 10, 10, 1)
                    GroupEnumUnitsInRect(SpellGroup, gg_rct_Battleground, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:Filter(u, owner) then
                            UnitAddAbility(u, self.AuraReincarnation)
                            DestroyEffect(
                                AddSpecialEffectTarget(self.Sfx, u, "origin")
                            )
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if data then
                        DestroyEffect(data.castSfx)
                        cb:Destroy()
                        IssueImmediateOrder(caster, "stop")
                    end
                    return false
                end
            )
        end
    )
end
GuardianAngel.Sfx = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl"
GuardianAngel.CastSfx = Models.CastDetermination
GuardianAngel.Aura = Auras.GuardianAngel
GuardianAngel.AuraReincarnation = Auras.Reincarnation
GuardianAngel.OrbCost = {}
return ____exports
