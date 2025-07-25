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
____exports.SummonEvilOutsider = {}
local SummonEvilOutsider = ____exports.SummonEvilOutsider
SummonEvilOutsider.name = "SummonEvilOutsider"
SummonEvilOutsider.__index = SummonEvilOutsider
SummonEvilOutsider.prototype = {}
SummonEvilOutsider.prototype.__index = SummonEvilOutsider.prototype
SummonEvilOutsider.prototype.constructor = SummonEvilOutsider
function SummonEvilOutsider.new(...)
    local self = setmetatable({}, SummonEvilOutsider.prototype)
    self:____constructor(...)
    return self
end
function SummonEvilOutsider.prototype.____constructor(self)
end
function SummonEvilOutsider.UnitAI(self, data)
    if GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function SummonEvilOutsider.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellEffect(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            if not ResourceBar:Get(owner):Consume({OrbType.Summoning, OrbType.Summoning}) then
                return
            end
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local sp = SpawnPoint:FromTarget(target)
            if not sp then
                return
            end
            local unitType = -1
            local unitTypeRanged = -1
            local color = {r = 255, g = 255, b = 255}
            if GetUnitAbilityLevel(caster, Buffs.Shadowcraft) > 0 then
                if level > 9 then
                    level = 9
                end
                unitType = self.HorrorType[level]
                color = self.HorrorVertexColor[level]
            else
                unitType = self.DemonTypeMelee[level]
            end
            if GetUnitAbilityLevel(caster, Buffs.Demonism) > 0 then
                unitTypeRanged = self.DemonTypeRanged[level]
            end
            local data = {
                loops = 10,
                spawnPoint = sp,
                unitType = unitType,
                unitTypeRanged = unitTypeRanged,
                timer = CreateTimer(),
                unit = CreateUnitAtLoc(sp.owner, unitType, sp.Point, sp.facing)
            }
            UnitCharge:Register(
                data.unit,
                function(uc) return self:UnitAI(uc) end,
                sp
            )
            RemoveGuardPosition(data.unit)
            SetUnitVertexColor(data.unit, color.r, color.g, color.b, 0)
            SetUnitInvulnerable(data.unit, true)
            if data.unitTypeRanged ~= -1 then
                data.unit2 = CreateUnitAtLoc(sp.owner, unitTypeRanged, sp.Point, sp.facing)
                UnitCharge:Register(
                    data.unit2,
                    function(uc) return self:UnitAI(uc) end,
                    sp
                )
                RemoveGuardPosition(data.unit2)
                SetUnitVertexColor(data.unit2, 255, 255, 255, 0)
                SetUnitInvulnerable(data.unit2, true)
            end
            TimerStart(
                data.timer,
                0.1,
                true,
                function()
                    if data.loops > 0 then
                        data.loops = data.loops - 1
                        SetUnitVertexColor(data.unit, color.r, color.g, color.b, 255 - data.loops * 25)
                        if data.unit2 then
                            SetUnitVertexColor(data.unit2, 255, 255, 255, 255 - data.loops * 25)
                        end
                    else
                        SetUnitVertexColor(data.unit, color.r, color.g, color.b, 255)
                        SetUnitInvulnerable(data.unit, false)
                        if data.unit2 then
                            SetUnitVertexColor(data.unit2, 255, 255, 255, 255)
                            SetUnitInvulnerable(data.unit2, false)
                        end
                        PauseTimer(data.timer)
                        DestroyTimer(data.timer)
                        PauseUnit(data.unit, false)
                        data = nil
                    end
                end
            )
        end
    )
end
SummonEvilOutsider.DemonTypeMelee = __TS__ArraySlice(SpawnedUnitTypes.Demon, 0, 10)
SummonEvilOutsider.DemonTypeRanged = __TS__ArraySlice(SpawnedUnitTypes.Demon, 10)
SummonEvilOutsider.HorrorType = SpawnedUnitTypes.Horror
SummonEvilOutsider.HorrorVertexColor = {[1] = {r = 0, g = 0, b = 0}, [2] = {r = 30, g = 0, b = 30}, [3] = {r = 255, g = 255, b = 255}, [4] = {r = 0, g = 0, b = 0}, [5] = {r = 0, g = 0, b = 0}, [6] = {r = 0, g = 0, b = 0}, [7] = {r = 100, g = 30, b = 100}, [8] = {r = 0, g = 0, b = 0}, [9] = {r = 0, g = 0, b = 0}}
return ____exports
