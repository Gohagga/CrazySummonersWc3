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
require("Config")
____exports.Taint = {}
local Taint = ____exports.Taint
Taint.name = "Taint"
Taint.__index = Taint
Taint.prototype = {}
Taint.prototype.__index = Taint.prototype
Taint.prototype.constructor = Taint
function Taint.new(...)
    local self = setmetatable({}, Taint.prototype)
    self:____constructor(...)
    return self
end
function Taint.prototype.____constructor(self, caster, targets, dmgMul)
    self.timer = CreateTimer()
    self.caster = caster
    self.targets = targets
    self.damageMultiplier = dmgMul
    for ____, u in ipairs(targets) do
        if GetUnitAbilityLevel(u, Buffs.Taint) then
            UnitAddAbility(u, ____exports.Taint.Aura1)
            UnitAddAbility(u, ____exports.Taint.Aura2)
        end
    end
end
function Taint.UpdateDamageBonus(self, data)
    if #data.targets == 0 then
        return false
    end
    local updatedTargets = {}
    for ____, u in ipairs(data.targets) do
        if GetUnitAbilityLevel(u, Buffs.Taint) < 1 then
            UnitRemoveAbility(u, self.Aura1)
            UnitRemoveAbility(u, self.Aura2)
        else
            __TS__ArrayPush(updatedTargets, u)
            local missingLifePercent = 1 - GetWidgetLife(u) / GetUnitState(u, UNIT_STATE_MAX_LIFE)
            local damageBonus = data.damageMultiplier * missingLifePercent
            local halfDamageBonus = math.floor(damageBonus + 0.5) + 1
            SetUnitAbilityLevel(u, self.Aura1, halfDamageBonus)
            SetUnitAbilityLevel(u, self.Aura2, halfDamageBonus)
        end
    end
    return true
end
function Taint.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetSpellTargetX()
            local y = GetSpellTargetY()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local castTime = 3.4 - 0.4 * level
            local data = {
                caster = caster,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                aoe = 150 + 100 * level,
                damageMultiplier = 12.5 + 12.5 * level,
                castTime = ({3, 2.5, 2, 1.5})[level],
                targets = {}
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2)
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Red}) then
                        return
                    end
                    local sfx = AddSpecialEffect(self.Sfx, x, y)
                    BlzSetSpecialEffectScale(sfx, 0.0045 * data.aoe)
                    DestroyEffect(sfx)
                    local targets = SpellHelper:TableEnumUnitsInRange(x, y, data.aoe, SpellHelper.UnitAliveFilter)
                    for ____, u in ipairs(targets) do
                        SpellHelper:DummyCastTarget(owner, x, y, u, self.DummySpellId, level, self.DummyOrder)
                    end
                    local taint = ____exports.Taint.new(caster, targets, data.damageMultiplier)
                    TimerStart(
                        taint.timer,
                        self.Period,
                        true,
                        function()
                            if self:UpdateDamageBonus(taint) == false then
                                PauseTimer(taint.timer)
                                DestroyTimer(taint.timer)
                            end
                        end
                    )
                    IssueImmediateOrder(caster, "spell")
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
Taint.DummySpellId = Dummies.Taint
Taint.DummyOrder = "unholyfrenzy"
Taint.Aura1 = Auras.Taint1
Taint.Aura2 = Auras.Taint2
Taint.Sfx = "Call of Dread Purple.mdl"
Taint.CastSfx = Models.CastSacrifice
Taint.Fps = 4
Taint.Period = 1
return ____exports
