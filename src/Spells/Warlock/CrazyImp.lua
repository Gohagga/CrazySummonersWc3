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
require("Config")
____exports.CrazyImp = {}
local CrazyImp = ____exports.CrazyImp
CrazyImp.name = "CrazyImp"
CrazyImp.__index = CrazyImp
CrazyImp.prototype = {}
CrazyImp.prototype.__index = CrazyImp.prototype
CrazyImp.prototype.constructor = CrazyImp
function CrazyImp.new(...)
    local self = setmetatable({}, CrazyImp.prototype)
    self:____constructor(...)
    return self
end
function CrazyImp.prototype.____constructor(self)
end
function CrazyImp.UnitAI(self, data)
    if GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function CrazyImp.init(self, spellId)
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
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Summoning}) then
                        return
                    end
                    do
                        data.unit = CreateUnitAtLoc(data.sp.owner, unitType, data.sp.Point, data.sp.facing)
                        UnitCharge:Register(
                            data.unit,
                            function(uc) return self:UnitAI(uc) end,
                            data.sp
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
CrazyImp.CastSfx = Models.CastSummoning
CrazyImp.Sfx = Models.CastSummoningInstant
CrazyImp.UnitSpawned = {Units.CrazyImp1, Units.CrazyImp2, Units.CrazyImp3, Units.CrazyImp4}
return ____exports
