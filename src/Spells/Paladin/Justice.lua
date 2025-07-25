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
____exports.Justice = {}
local Justice = ____exports.Justice
Justice.name = "Justice"
Justice.__index = Justice
Justice.prototype = {}
Justice.prototype.__index = Justice.prototype
Justice.prototype.constructor = Justice
function Justice.new(...)
    local self = setmetatable({}, Justice.prototype)
    self:____constructor(...)
    return self
end
function Justice.prototype.____constructor(self)
end
function Justice.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local coef1 = 1
            local coef2 = 500
            local life = GetUnitState(target, UNIT_STATE_MAX_LIFE)
            local data = {
                aoe = 100 + 150 * level,
                targetSfx = AddSpecialEffectTarget(self.Sfx, target, "chest"),
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = ({3.5, 3, 2.5, 2})[level],
                damage = (life * coef1) / (life + coef2 - level * 100 + 100) * life
            }
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
                    UnitDamageTarget(caster, target, data.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                    DestroyEffect(
                        AddSpecialEffectTarget(self.DamageSfx, target, "origin")
                    )
                    IssueImmediateOrder(caster, "spell")
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
Justice.Sfx = "Abilities\\Spells\\Orc\\SpiritLink\\SpiritLinkTarget.mdl"
Justice.DamageSfx = "StormfallOrange.mdl"
Justice.CastSfx = Models.CastRepentance
return ____exports
