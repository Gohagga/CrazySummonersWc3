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
local SpellHelper = ____SpellHelper.SpellHelper
local SpellGroup = ____SpellHelper.SpellGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.CorruptedBlood = {}
local CorruptedBlood = ____exports.CorruptedBlood
CorruptedBlood.name = "CorruptedBlood"
CorruptedBlood.__index = CorruptedBlood
CorruptedBlood.prototype = {}
CorruptedBlood.prototype.__index = CorruptedBlood.prototype
CorruptedBlood.prototype.constructor = CorruptedBlood
function CorruptedBlood.new(...)
    local self = setmetatable({}, CorruptedBlood.prototype)
    self:____constructor(...)
    return self
end
function CorruptedBlood.prototype.____constructor(self, target, level, owner)
    self.owner = owner
    self.level = level
end
function CorruptedBlood.Filter(self, target)
    return IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false and GetWidgetLife(target) > 0.405 and IsUnitType(target, UNIT_TYPE_STRUCTURE) == false and IsUnitType(target, UNIT_TYPE_MECHANICAL) == false and IsUnitType(target, UNIT_TYPE_HERO) == false
end
function CorruptedBlood.Apply(self, target, owner, level)
    local dummyLvl = level
    if GetUnitTypeId(target) == Units.VolatileLeeches then
        dummyLvl = 5
    end
    SpellHelper:DummyCastTarget(
        owner,
        GetUnitX(target),
        GetUnitY(target),
        target,
        ____exports.CorruptedBlood.DummySpellId,
        dummyLvl,
        ____exports.CorruptedBlood.DummyOrder
    )
    UnitAddType(target, UNIT_TYPE_SAPPER)
    self._instance[GetHandleId(target)] = ____exports.CorruptedBlood.new(target, level, owner)
end
function CorruptedBlood.RemoveBuff(self, target)
    UnitRemoveAbility(target, Buffs.CorruptedBlood)
    UnitRemoveType(target, UNIT_TYPE_SAPPER)
end
function CorruptedBlood.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Red, OrbType.Red}
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local life = GetUnitState(target, UNIT_STATE_MAX_LIFE)
            local data = {
                done = false,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                damage = life * (0.35 + 0.15 * level),
                threshold = 0.9 - 0.1 * level,
                castTime = 1.5
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
                    DestroyEffect(
                        AddSpecialEffectTarget(self.Sfx, target, "chest")
                    )
                    self:Apply(target, owner, level)
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
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)
    TriggerAddAction(
        t,
        function()
            local target = GetTriggerUnit()
            local instance = self._instance[GetHandleId(target)]
            if not instance then
                return
            end
            local level = instance.level
            local owner = instance.owner
            local aoe = 250
            GroupEnumUnitsInRange(
                SpellGroup,
                GetUnitX(target),
                GetUnitY(target),
                aoe,
                nil
            )
            local u = FirstOfGroup(SpellGroup)
            while u ~= nil do
                GroupRemoveUnit(SpellGroup, u)
                if self:Filter(u) then
                    self:Apply(u, owner, level)
                end
                u = FirstOfGroup(SpellGroup)
            end
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
CorruptedBlood._instance = {}
CorruptedBlood.DummySpellId = Dummies.CorruptedBlood
CorruptedBlood.DummyOrder = "unholyfrenzy"
CorruptedBlood.Sfx = "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdl"
CorruptedBlood.TargetSfx = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl"
CorruptedBlood.CastSfx = Models.CastSacrifice
CorruptedBlood.SpawnedType = __TS__ArraySlice(SpawnedUnitTypes.Undead, 10)
CorruptedBlood.Aoe = {250, 250, 250, 250, 250}
CorruptedBlood.OrbCost = {}
return ____exports
