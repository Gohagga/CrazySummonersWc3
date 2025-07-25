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
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
require("Config")
____exports.VolatileLeeches = {}
local VolatileLeeches = ____exports.VolatileLeeches
VolatileLeeches.name = "VolatileLeeches"
VolatileLeeches.__index = VolatileLeeches
VolatileLeeches.prototype = {}
VolatileLeeches.prototype.__index = VolatileLeeches.prototype
VolatileLeeches.prototype.constructor = VolatileLeeches
function VolatileLeeches.new(...)
    local self = setmetatable({}, VolatileLeeches.prototype)
    self:____constructor(...)
    return self
end
function VolatileLeeches.prototype.____constructor(self)
end
function VolatileLeeches.HealFilter(self, target, owner)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and IsUnitAlly(target, owner) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and (GetUnitAbilityLevel(target, Buffs.CorruptedBlood) < 1) and (GetWidgetLife(target) > 0.405)
end
function VolatileLeeches.DamageFilter(self, target)
    return IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false and IsUnitType(target, UNIT_TYPE_STRUCTURE) == false and IsUnitType(target, UNIT_TYPE_MECHANICAL) == false and IsUnitType(target, UNIT_TYPE_HERO) == false and GetWidgetLife(target) > 0.405
end
function VolatileLeeches.UnitAI(self, data)
    if GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function VolatileLeeches.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Red, OrbType.Summoning}
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
            local unitType = self.UnitSpawned
            local data = {
                done = false,
                loops = 10,
                spawnPoint = sp,
                timer = CreateTimer(),
                castTime = 2,
                sp = sp,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin")
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
                    local units = {}
                    local next = sp
                    local spawnMap = self.SpawnMap[level]
                    for ____, n in ipairs(spawnMap) do
                        if not next then
                            break
                        end
                        do
                            local i = 0
                            while i < n do
                                local u = CreateUnitAtLoc(next.owner, unitType, next.Point, next.facing)
                                UnitCharge:Register(
                                    u,
                                    function(uc) return self:UnitAI(uc) end,
                                    next
                                )
                                RemoveGuardPosition(u)
                                SetUnitVertexColor(u, 0, 0, 0, 0)
                                SetUnitInvulnerable(u, true)
                                SetWidgetLife(u, 1)
                                SetUnitAbilityLevel(u, self.AuraDamage, level)
                                __TS__ArrayPush(units, u)
                                i = i + 1
                            end
                        end
                        next = next:Next()
                    end
                    data.units = units
                    TimerStart(
                        data.timer,
                        0.1,
                        true,
                        function()
                            if data.loops > 0 then
                                data.loops = data.loops - 1
                                for unit in __TS__Iterator(data.units) do
                                    SetUnitVertexColor(unit, 0, 0, 0, 0 - data.loops * 25)
                                end
                            else
                                for unit in __TS__Iterator(data.units) do
                                    SetUnitVertexColor(unit, 0, 0, 0, 255)
                                    SetUnitInvulnerable(unit, false)
                                    PauseUnit(unit, false)
                                end
                                PauseTimer(data.timer)
                                DestroyTimer(data.timer)
                                data = nil
                            end
                        end
                    )
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if data.done == false then
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
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ATTACKED)
    TriggerAddAction(
        t,
        function()
            local attacker = GetAttacker()
            if GetUnitTypeId(attacker) ~= Units.VolatileLeeches then
                return
            end
            local owner = GetOwningPlayer(attacker)
            local bites = GetUnitAbilityLevel(attacker, self.AuraBites)
            local hp = GetWidgetLife(attacker)
            local aoe = 250
            if bites >= 8 then
                if GetUnitAbilityLevel(attacker, Buffs.CorruptedBlood) > 0 then
                    GroupEnumUnitsInRange(
                        SpellGroup,
                        GetUnitX(attacker),
                        GetUnitY(attacker),
                        aoe,
                        nil
                    )
                    local unitsToDamage = {}
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:DamageFilter(u) then
                            __TS__ArrayPush(unitsToDamage, u)
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
                    local dmg = hp / #unitsToDamage
                    for ____, u in ipairs(unitsToDamage) do
                        UnitDamageTarget(attacker, u, dmg, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                    end
                else
                    GroupEnumUnitsInRange(
                        SpellGroup,
                        GetUnitX(attacker),
                        GetUnitY(attacker),
                        aoe,
                        nil
                    )
                    local unitsToHeal = {}
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:HealFilter(u, owner) then
                            __TS__ArrayPush(unitsToHeal, u)
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
                    local heal = hp / #unitsToHeal
                    for ____, u in ipairs(unitsToHeal) do
                        SetWidgetLife(
                            u,
                            GetWidgetLife(u) + heal
                        )
                    end
                end
                DestroyEffect(
                    AddSpecialEffect(
                        self.ExplodeSfx,
                        GetUnitX(attacker),
                        GetUnitY(attacker)
                    )
                )
                KillUnit(attacker)
            else
                local scale = 0.6 + hp / 100 - hp * 0.004
                SetUnitScale(attacker, scale, scale, scale)
                SetUnitVertexColor(
                    attacker,
                    math.floor(255 * 0.09 * bites),
                    0,
                    0,
                    255
                )
                SetUnitAbilityLevel(attacker, self.AuraBites, bites + 1)
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
VolatileLeeches.DummyOrder = "charm"
VolatileLeeches.AuraDamage = Auras.VolatileLeechesDamage
VolatileLeeches.AuraBites = Auras.VolatileLeechesBites
VolatileLeeches.CastSfx = Models.CastSacrifice
VolatileLeeches.ExplodeSfx = Models.BloodExplosion
VolatileLeeches.UnitSpawned = Units.VolatileLeeches
VolatileLeeches.OrbCost = {}
VolatileLeeches.SpawnMap = {{1, 1, 0, 0, 1}, {2, 1, 0, 0, 1}, {2, 2, 0, 0, 2}, {2, 2, 1, 1, 2}}
return ____exports
