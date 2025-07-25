local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.RitualOfDeath = {}
local RitualOfDeath = ____exports.RitualOfDeath
RitualOfDeath.name = "RitualOfDeath"
RitualOfDeath.__index = RitualOfDeath
RitualOfDeath.prototype = {}
RitualOfDeath.prototype.__index = RitualOfDeath.prototype
RitualOfDeath.prototype.constructor = RitualOfDeath
function RitualOfDeath.new(...)
    local self = setmetatable({}, RitualOfDeath.prototype)
    self:____constructor(...)
    return self
end
function RitualOfDeath.prototype.____constructor(self)
end
function RitualOfDeath.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local data = {
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                targetSfx = AddSpecialEffectTarget(self.TargetSfx, target, "origin"),
                nonDamageChance = 0.05 * level + 0.05,
                castTime = 7 - 1.5 * level
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2)
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    DestroyEffect(data.targetSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Red}) then
                        return
                    end
                    if math.random() > data.nonDamageChance then
                        UnitDamageTarget(caster, caster, 1, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                    end
                    if IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false then
                        DestroyEffect(
                            AddSpecialEffectTarget(self.Sfx, target, "chest")
                        )
                        UnitDamageTarget(
                            caster,
                            target,
                            GetUnitState(target, UNIT_STATE_MAX_LIFE),
                            false,
                            false,
                            ATTACK_TYPE_NORMAL,
                            DAMAGE_TYPE_MAGIC,
                            WEAPON_TYPE_WHOKNOWS
                        )
                    end
                    IssueImmediateOrder(caster, "stand")
                    QueueUnitAnimation(caster, "spell")
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if data then
                        DestroyEffect(data.castSfx)
                        DestroyEffect(data.targetSfx)
                        cb:Destroy()
                        IssueImmediateOrder(caster, "stop")
                    end
                    return false
                end
            )
        end
    )
end
RitualOfDeath.DummySpellId = Dummies.ContagiousInsanity
RitualOfDeath.DummyOrder = "bloodlust"
RitualOfDeath.Sfx = Models.CorpseBomb
RitualOfDeath.TargetSfx = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl"
RitualOfDeath.CastSfx = Models.CastSacrifice
return ____exports
