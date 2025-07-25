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
local OrbCostToString = ____Orb.OrbCostToString
require("Config")
____exports.SummonAbomination = {}
local SummonAbomination = ____exports.SummonAbomination
SummonAbomination.name = "SummonAbomination"
SummonAbomination.__index = SummonAbomination
SummonAbomination.prototype = {}
SummonAbomination.prototype.__index = SummonAbomination.prototype
SummonAbomination.prototype.constructor = SummonAbomination
function SummonAbomination.new(...)
    local self = setmetatable({}, SummonAbomination.prototype)
    self:____constructor(...)
    return self
end
function SummonAbomination.prototype.____constructor(self)
end
function SummonAbomination.UnitAI(self, data)
    if GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function SummonAbomination.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Summoning}
    SpellEvent:RegisterSpellEffect(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            if not ResourceBar:Get(owner):Consume(self.OrbCost) then
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
SummonAbomination.SpawnedType = __TS__ArraySlice(SpawnedUnitTypes.Undead, 10)
SummonAbomination.OrbCost = {}
return ____exports
