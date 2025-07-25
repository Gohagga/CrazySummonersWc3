require("lualib_bundle");
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
require("Config")
____exports.ArmyOfTheDead = {}
local ArmyOfTheDead = ____exports.ArmyOfTheDead
ArmyOfTheDead.name = "ArmyOfTheDead"
ArmyOfTheDead.__index = ArmyOfTheDead
ArmyOfTheDead.prototype = {}
ArmyOfTheDead.prototype.__index = ArmyOfTheDead.prototype
ArmyOfTheDead.prototype.constructor = ArmyOfTheDead
function ArmyOfTheDead.new(...)
    local self = setmetatable({}, ArmyOfTheDead.prototype)
    self:____constructor(...)
    return self
end
function ArmyOfTheDead.prototype.____constructor(self)
end
function ArmyOfTheDead.Filter(self, target)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and (GetWidgetLife(target) <= 0.405)
end
function ArmyOfTheDead.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Red, OrbType.Blue, OrbType.Purple}
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetSpellTargetX()
            local y = GetSpellTargetY()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local might = math.fmod((level - 1), 4)
            local will = math.floor((level - 1) / 4)
            local data = {
                done = false,
                aoe = 250 + 50 * will,
                duration = 8 + will * 2,
                summonLevel = GetUnitAbilityLevel(caster, Spells.SummonGhoul) + might,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 3
            }
            if data.summonLevel < 1 then
                data.summonLevel = 1
            end
            if data.summonLevel > 10 then
                data.summonLevel = 10
            end
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
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:Filter(u) then
                            local pos = GetUnitLoc(u)
                            local facing = GetUnitFacing(u)
                            local rep = CreateUnitAtLoc(owner, self.SpawnedType[data.summonLevel], pos, facing)
                            UnitApplyTimedLife(rep, self.BuffId, data.duration)
                            SetUnitVertexColor(rep, 120, 35, 35, 255)
                            UnitAddAbility(rep, Auras.LanePersistance)
                            UnitAddAbility(u, self.AuraBuff)
                            SetUnitExploded(rep, true)
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
ArmyOfTheDead.BuffId = Buffs.ArmyOfTheDead
ArmyOfTheDead.AuraBuff = Auras.ArmyOfTheDead
ArmyOfTheDead.SpawnedType = __TS__ArraySlice(SpawnedUnitTypes.Undead, 0, 10)
ArmyOfTheDead.Sfx = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl"
ArmyOfTheDead.CastSfx = Models.CastSacrifice
ArmyOfTheDead.OrbCost = {}
return ____exports
