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
local ____Spawn = require("Spells.Spawn")
local SpawnPoint = ____Spawn.SpawnPoint
local ____UnitCharge = require("Systems.UnitCharge")
local UnitCharge = ____UnitCharge.UnitCharge
require("Config")
____exports.Redemption = {}
local Redemption = ____exports.Redemption
Redemption.name = "Redemption"
Redemption.__index = Redemption
Redemption.prototype = {}
Redemption.prototype.__index = Redemption.prototype
Redemption.prototype.constructor = Redemption
function Redemption.new(...)
    local self = setmetatable({}, Redemption.prototype)
    self:____constructor(...)
    return self
end
function Redemption.prototype.____constructor(self)
end
function Redemption.Filter(self, target)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false)
end
function Redemption.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local sp = SpawnPoint:FromTarget(target)
            if not sp then
                return
            end
            local data = {
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                healPercent = 0.2 + level * 0.05,
                revivePercent = level * 0.2,
                castTime = 4 - 0.5 * level
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.Red, OrbType.Blue}) then
                        return
                    end
                    GroupEnumUnitsInRect(SpellGroup, sp.region, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:Filter(u) then
                            local notCorrupted = GetUnitAbilityLevel(target, Buffs.CorruptedBlood) < 1
                            local unitHp = GetWidgetLife(u)
                            if IsUnitAlly(u, owner) and unitHp > 0.405 then
                                DestroyEffect(
                                    AddSpecialEffectTarget(self.HealSfx, u, "origin")
                                )
                                if notCorrupted then
                                    SetWidgetLife(
                                        u,
                                        GetWidgetLife(u) + data.healPercent * GetUnitState(u, UNIT_STATE_MAX_LIFE)
                                    )
                                end
                            elseif unitHp <= 0.405 or IsUnitType(u, UNIT_TYPE_DEAD) then
                                local handleId = GetHandleId(u)
                                u = ReplaceUnitBJ(
                                    u,
                                    GetUnitTypeId(u),
                                    bj_UNIT_STATE_METHOD_MAXIMUM
                                )
                                UnitCharge:Reregister(u, handleId)
                                RemoveGuardPosition(u)
                                SetWidgetLife(
                                    u,
                                    GetWidgetLife(u) * data.revivePercent
                                )
                                DestroyEffect(
                                    AddSpecialEffectTarget(self.ResurrectSfx, u, "origin")
                                )
                                if GetOwningPlayer(u) ~= sp.owner then
                                    SetUnitOwner(u, sp.owner, true)
                                end
                            end
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
Redemption.ResurrectSfx = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl"
Redemption.HealSfx = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl"
Redemption.CastSfx = Models.CastRestoration
return ____exports
