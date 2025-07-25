local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____Spawn = require("Spells.Spawn")
local SpawnPoint = ____Spawn.SpawnPoint
local ____UnitCharge = require("Systems.UnitCharge")
local UnitCharge = ____UnitCharge.UnitCharge
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
require("Config")
____exports.CallSuccubus = {}
local CallSuccubus = ____exports.CallSuccubus
CallSuccubus.name = "CallSuccubus"
CallSuccubus.__index = CallSuccubus
CallSuccubus.prototype = {}
CallSuccubus.prototype.__index = CallSuccubus.prototype
CallSuccubus.prototype.constructor = CallSuccubus
function CallSuccubus.new(...)
    local self = setmetatable({}, CallSuccubus.prototype)
    self:____constructor(...)
    return self
end
function CallSuccubus.prototype.____constructor(self)
end
function CallSuccubus.Filter(self, target, owner)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitAlly(target, owner) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and (GetWidgetLife(target) > 0.405)
end
function CallSuccubus.UnitAI(self, data)
    if GetUnitState(data.unit, UNIT_STATE_MANA) >= 24.5 then
        local owner = GetOwningPlayer(data.unit)
        GroupEnumUnitsInRange(
            SpellGroup,
            GetUnitX(data.unit),
            GetUnitY(data.unit),
            700,
            nil
        )
        local u = FirstOfGroup(SpellGroup)
        local notCast = true
        while u ~= nil and notCast do
            GroupRemoveUnit(SpellGroup, u)
            if self:Filter(u, owner) then
                IssueTargetOrder(data.unit, self.DummyOrder, u)
                SetUnitState(data.unit, UNIT_STATE_MANA, 0)
                UnitCharge:FromUnit(u).destination = data.destination
                notCast = false
            end
            u = FirstOfGroup(SpellGroup)
        end
    elseif GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function CallSuccubus.init(self, spellId)
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
            local unitType = self.UnitSpawned[level]
            local data = {
                loops = 10,
                spawnPoint = sp,
                unitType = unitType,
                timer = CreateTimer(),
                castTime = 4 - 0.5 * level,
                sp = sp,
                castSfx = AddSpecialEffect(
                    self.CastSfx,
                    GetUnitX(caster),
                    GetUnitY(caster)
                )
            }
            BlzSetSpecialEffectScale(data.castSfx, 2)
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Red, OrbType.Summoning}) then
                        return
                    end
                    do
                        data.unit = CreateUnitAtLoc(data.sp.owner, unitType, data.sp.Point, data.sp.facing)
                        UnitCharge:Register(
                            data.unit,
                            function(uc) return self:UnitAI(uc) end,
                            sp
                        )
                    end
                    RemoveGuardPosition(data.unit)
                    SetUnitVertexColor(data.unit, 255, 255, 255, 0)
                    SetUnitInvulnerable(data.unit, true)
                    AddSpecialEffect(
                        self.Sfx,
                        GetUnitX(data.unit),
                        GetUnitY(data.unit)
                    )
                    TimerStart(
                        data.timer,
                        0.1,
                        true,
                        function()
                            if data.loops > 0 then
                                data.loops = data.loops - 1
                                SetUnitVertexColor(data.unit, 255, 255, 255, 255 - data.loops * 25)
                            else
                                SetUnitVertexColor(data.unit, 255, 255, 255, 255)
                                SetUnitInvulnerable(data.unit, false)
                                PauseTimer(data.timer)
                                DestroyTimer(data.timer)
                                PauseUnit(data.unit, false)
                                data = nil
                            end
                        end
                    )
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
CallSuccubus.DummyOrder = "charm"
CallSuccubus.CastSfx = Models.CastSummoning
CallSuccubus.Sfx = Models.CastSummoningInstant
CallSuccubus.UnitSpawned = {[1] = Units.Succubus1, [2] = Units.Succubus2, [3] = Units.Succubus3, [4] = Units.Succubus4}
return ____exports
