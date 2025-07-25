require("lualib_bundle");
local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local OrbCostToString = ____Orb.OrbCostToString
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
local ____UnitCharge = require("Systems.UnitCharge")
local UnitCharge = ____UnitCharge.UnitCharge
require("Config")
____exports.DeathsEmbrace = {}
local DeathsEmbrace = ____exports.DeathsEmbrace
DeathsEmbrace.name = "DeathsEmbrace"
DeathsEmbrace.__index = DeathsEmbrace
DeathsEmbrace.prototype = {}
DeathsEmbrace.prototype.__index = DeathsEmbrace.prototype
DeathsEmbrace.prototype.constructor = DeathsEmbrace
function DeathsEmbrace.new(...)
    local self = setmetatable({}, DeathsEmbrace.prototype)
    self:____constructor(...)
    return self
end
function DeathsEmbrace.prototype.____constructor(self)
end
function DeathsEmbrace.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Blue}
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
                    local hp = GetWidgetLife(target)
                    if UnitTypeFlags:IsUnitUndead(target) then
                        UnitDamageTarget(caster, target, data.damage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                    elseif hp / life > data.threshold then
                        local handleId = GetHandleId(target)
                        local rep = ReplaceUnitBJ(
                            target,
                            self.SpawnedType[GetUnitLevel(target) + 1],
                            bj_UNIT_STATE_METHOD_MAXIMUM
                        )
                        UnitCharge:Reregister(rep, handleId)
                        RemoveGuardPosition(rep)
                        SetWidgetLife(rep, hp)
                    else
                        UnitDamageTarget(caster, target, hp * 0.3, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
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
DeathsEmbrace.DummySpellId = Dummies.ContagiousInsanity
DeathsEmbrace.DummyOrder = "bloodlust"
DeathsEmbrace.SpawnedType = __TS__ArraySlice(SpawnedUnitTypes.Undead, 10)
DeathsEmbrace.Sfx = "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdl"
DeathsEmbrace.TargetSfx = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl"
DeathsEmbrace.CastSfx = Models.CastSacrifice
DeathsEmbrace.OrbCost = {}
return ____exports
