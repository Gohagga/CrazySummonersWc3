require("lualib_bundle");
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
require("Config")
____exports.SummonMelee = {}
local SummonMelee = ____exports.SummonMelee
SummonMelee.name = "SummonMelee"
SummonMelee.__index = SummonMelee
SummonMelee.prototype = {}
SummonMelee.prototype.__index = SummonMelee.prototype
SummonMelee.prototype.constructor = SummonMelee
function SummonMelee.new(...)
    local self = setmetatable({}, SummonMelee.prototype)
    self:____constructor(...)
    return self
end
function SummonMelee.prototype.____constructor(self)
end
function SummonMelee.UnitAI(self, data)
    if GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function SummonMelee.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellEffect(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            if not ResourceBar:Get(owner):Consume({OrbType.Summoning}) then
                return
            end
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local sp = SpawnPoint:FromTarget(target)
            local unitType = self.SpawnedType[level]
            if not sp then
                return
            end
            local data = {
                loops = 10,
                spawnPoint = sp,
                unitType = unitType,
                timer = CreateTimer(),
                unit = CreateUnitAtLoc(sp.owner, unitType, sp.Point, sp.facing)
            }
            UnitCharge:Register(
                data.unit,
                function(uc) return self:UnitAI(uc) end,
                sp
            )
            RemoveGuardPosition(data.unit)
            SetUnitVertexColor(data.unit, 255, 255, 255, 0)
            SetUnitInvulnerable(data.unit, true)
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
                        PauseTimer(data.timer)
                        DestroyTimer(data.timer)
                        PauseUnit(data.unit, false)
                        SetUnitInvulnerable(data.unit, false)
                        data = nil
                    end
                end
            )
        end
    )
end
SummonMelee.SpawnedType = __TS__ArraySlice(SpawnedUnitTypes.Human, 0, 10)
return ____exports
