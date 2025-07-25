local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
local SpellGroup = ____SpellHelper.SpellGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.ContagiousInsanity = {}
local ContagiousInsanity = ____exports.ContagiousInsanity
ContagiousInsanity.name = "ContagiousInsanity"
ContagiousInsanity.__index = ContagiousInsanity
ContagiousInsanity.prototype = {}
ContagiousInsanity.prototype.__index = ContagiousInsanity.prototype
ContagiousInsanity.prototype.constructor = ContagiousInsanity
function ContagiousInsanity.new(...)
    local self = setmetatable({}, ContagiousInsanity.prototype)
    self:____constructor(...)
    return self
end
function ContagiousInsanity.prototype.____constructor(self, target, data)
    self.spreadRange = data.spreadRange
    self.spreadInterval = data.spreadInterval
    self.repeatCount = data.repeatCount
    self.spreadCount = data.spreadCount
    self.level = data.level
    self.target = target
    self.timer = CreateTimer()
    SpellHelper:DummyCastTarget(
        Player(PLAYER_NEUTRAL_PASSIVE),
        GetUnitX(target),
        GetUnitY(target),
        target,
        ____exports.ContagiousInsanity.DummySpellId,
        self.level,
        ____exports.ContagiousInsanity.DummyOrder
    )
    if self.repeatCount > 0 then
        TimerStart(
            self.timer,
            data.spreadInterval,
            true,
            function()
                if GetUnitAbilityLevel(self.target, Buffs.ContagiousInsanity) < 1 or self.repeatCount == 0 then
                    PauseTimer(self.timer)
                    DestroyTimer(self.timer)
                else
                    GroupEnumUnitsInRange(
                        SpellGroup,
                        GetUnitX(self.target),
                        GetUnitY(self.target),
                        self.spreadRange,
                        SpellHelper.UnitAliveFilter
                    )
                    local u = FirstOfGroup(SpellGroup)
                    local count = self.spreadCount
                    while u ~= nil and count > 0 do
                        GroupRemoveUnit(SpellGroup, u)
                        if GetUnitAbilityLevel(u, Buffs.ContagiousInsanity) < 1 then
                            local ci = ____exports.ContagiousInsanity.new(u, {level = self.level, spreadCount = self.spreadCount, repeatCount = self.repeatCount - 1, spreadInterval = self.spreadInterval, spreadRange = self.spreadRange})
                            count = count - 1
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
                end
            end
        )
    end
end
function ContagiousInsanity.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local data = {
                range = 400,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "chest"),
                castTime = 2,
                spreadInterval = 1,
                spreadCount = 1 + math.floor(level * 0.5),
                repeatCount = math.floor(1.5 + level * 0.5)
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Blue}) then
                        return
                    end
                    local ci = ____exports.ContagiousInsanity.new(target, {level = level, repeatCount = data.repeatCount, spreadCount = data.spreadCount, spreadInterval = data.spreadInterval, spreadRange = data.range})
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
ContagiousInsanity.DummySpellId = Dummies.ContagiousInsanity
ContagiousInsanity.DummyOrder = "bloodlust"
ContagiousInsanity.Sfx = "Abilities\\Spells\\Orc\\SpiritLink\\SpiritLinkTarget.mdl"
ContagiousInsanity.DamageSfx = "StormfallOrange.mdl"
ContagiousInsanity.CastSfx = Models.CastShadow
return ____exports
