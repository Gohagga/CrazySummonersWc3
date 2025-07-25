require("lualib_bundle");
local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.StealEssence = {}
local StealEssence = ____exports.StealEssence
StealEssence.name = "StealEssence"
StealEssence.__index = StealEssence
StealEssence.prototype = {}
StealEssence.prototype.__index = StealEssence.prototype
StealEssence.prototype.constructor = StealEssence
function StealEssence.new(...)
    local self = setmetatable({}, StealEssence.prototype)
    self:____constructor(...)
    return self
end
function StealEssence.prototype.____constructor(self)
end
function StealEssence.GetDamage(self, spellLevel, unitLevel)
    if unitLevel > 15 then
        unitLevel = 15
    end
    return (0.2 + 0.4 * spellLevel) * (161 + 51 * unitLevel)
end
function StealEssence.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetSpellTargetX()
            local y = GetSpellTargetY()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local data = {
                aoe = 360,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "chest"),
                damage = self:GetDamage(
                    level,
                    GetUnitLevel(caster)
                ),
                castTime = ({3, 2.5, 2, 1.5})[level]
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Purple, OrbType.Blue, OrbType.Red}) then
                        return
                    end
                    GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, nil)
                    local unitsToDamage = {}
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) == false and GetWidgetLife(u) > 0.405 and IsUnitType(u, UNIT_TYPE_STRUCTURE) == false and IsUnitType(u, UNIT_TYPE_MECHANICAL) == false and IsUnitType(u, UNIT_TYPE_HERO) == false then
                            __TS__ArrayPush(unitsToDamage, u)
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
                    local singleDamage = data.damage / #unitsToDamage
                    local hasGainedHp = false
                    for ____, unit in ipairs(unitsToDamage) do
                        UnitDamageTarget(caster, unit, singleDamage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS)
                        DestroyEffect(
                            AddSpecialEffectTarget(self.DamageSfx, unit, "origin")
                        )
                        if GetWidgetLife(unit) <= 0.405 then
                            SetWidgetLife(
                                caster,
                                GetWidgetLife(caster) + 1
                            )
                            hasGainedHp = true
                            DestroyEffect(
                                AddSpecialEffectTarget(self.KillSfx, unit, "origin")
                            )
                        end
                    end
                    if hasGainedHp then
                        DestroyEffect(
                            AddSpecialEffectTarget(self.HealSfx, caster, "origin")
                        )
                    end
                    IssueImmediateOrder(caster, "stop")
                    QueueUnitAnimation(caster, "spell")
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
StealEssence.DamageSfx = "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl"
StealEssence.KillSfx = "Objects\\Spawnmodels\\Undead\\UndeadDissipate\\UndeadDissipate.mdl"
StealEssence.HealSfx = "Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl"
StealEssence.CastSfx = Models.CastShadow
return ____exports
