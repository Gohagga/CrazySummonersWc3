require("lualib_bundle");
local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
____exports.Rejuvenate = {}
local Rejuvenate = ____exports.Rejuvenate
Rejuvenate.name = "Rejuvenate"
Rejuvenate.__index = Rejuvenate
Rejuvenate.prototype = {}
Rejuvenate.prototype.__index = Rejuvenate.prototype
Rejuvenate.prototype.constructor = Rejuvenate
function Rejuvenate.new(...)
    local self = setmetatable({}, Rejuvenate.prototype)
    self:____constructor(...)
    return self
end
function Rejuvenate.prototype.____constructor(self, caster, point, maxUnits, healing, aoe)
    self.caster = caster
    self.x = GetLocationX(point)
    self.y = GetLocationY(point)
    self.maxUnits = maxUnits
    self.healing = healing
    self.aoe = aoe
    self.timer = CreateTimer()
    self.castSfx = AddSpecialEffectTarget(____exports.Rejuvenate.CastSfx, caster, "origin")
end
function Rejuvenate.GetUnitPriority(self, unit)
    local hp = GetWidgetLife(unit)
    local value = hp * 0.01 + hp / GetUnitState(unit, UNIT_STATE_MAX_LIFE) * 5
    if GetWidgetLife(unit) >= GetUnitState(unit, UNIT_STATE_MAX_LIFE) * 0.995 then
        value = value * 3
    end
    return value
end
function Rejuvenate.HealPriorityTargets(self, data)
    self.FilterPlayer = GetOwningPlayer(data.caster)
    local units = SpellHelper:TableEnumUnitsInRange(data.x, data.y, data.aoe, self.TargetFilter)
    local priorities = {}
    do
        local i = 0
        while i < #units do
            __TS__ArrayPush(
                priorities,
                {
                    value = self:GetUnitPriority(units[i + 1]),
                    index = i
                }
            )
            i = i + 1
        end
    end
    __TS__ArraySort(
        priorities,
        function(____, a, b) return a.value - b.value end
    )
    do
        local i = 0
        while i < data.maxUnits and i < #priorities do
            local u = units[priorities[i + 1].index + 1]
            if GetUnitAbilityLevel(u, self.CorruptedBloodId) < 1 then
                SetWidgetLife(
                    u,
                    GetWidgetLife(u) + data.healing * GetUnitState(u, UNIT_STATE_MAX_LIFE)
                )
            end
            DestroyEffect(
                AddSpecialEffectTarget(self.Sfx, u, "origin")
            )
            i = i + 1
        end
    end
end
function Rejuvenate.init(self, spellId, corruptedBloodId, castSfx)
    self.SpellId = spellId
    self.CorruptedBloodId = corruptedBloodId
    self.CastSfx = castSfx
    SpellHelper:Preload(self.SpellId)
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local point = GetSpellTargetLoc()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local castTime = 5
            if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.White}) then
                return
            end
            local data = ____exports.Rejuvenate.new(caster, point, level, 0.25, 200 + 100 * level)
            TimerStart(
                data.timer,
                1.2,
                true,
                function()
                    self:HealPriorityTargets(data)
                end
            )
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    PauseTimer(data.timer)
                    DestroyTimer(data.timer)
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if data then
                        DestroyEffect(data.castSfx)
                        PauseTimer(data.timer)
                        DestroyTimer(data.timer)
                        cb:Destroy()
                        IssueImmediateOrder(caster, "stop")
                    end
                    return false
                end
            )
        end
    )
end
Rejuvenate.Sfx = "Abilities/Spells/Demon/DarkPortal/DarkPortalTarget.mdl"
Rejuvenate.CastSfx = ""
Rejuvenate.TargetFilter = Filter(
    function()
        local u = GetFilterUnit()
        return IsUnitEnemy(u, ____exports.Rejuvenate.FilterPlayer) == false and IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) == false and GetWidgetLife(u) > 0.405 and IsUnitType(u, UNIT_TYPE_HERO) == false
    end
)
return ____exports
