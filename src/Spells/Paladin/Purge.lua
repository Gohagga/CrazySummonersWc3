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
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
local ____Dispel = require("Systems.Dispel")
local Dispel = ____Dispel.Dispel
require("Config")
____exports.Purge = {}
local Purge = ____exports.Purge
Purge.name = "Purge"
Purge.__index = Purge
Purge.prototype = {}
Purge.prototype.__index = Purge.prototype
Purge.prototype.constructor = Purge
function Purge.new(...)
    local self = setmetatable({}, Purge.prototype)
    self:____constructor(...)
    return self
end
function Purge.prototype.____constructor(self)
end
function Purge.init(self, spellId)
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
                aoe = 300 + 50 * level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = ({1.5, 1.2, 0.9, 0.6})[level],
                damage = 100 + level * 50
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.Red}) then
                        return
                    end
                    GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if (UnitTypeFlags:IsUnitUndead(u) or UnitTypeFlags:IsUnitDemon(u)) and IsUnitAlly(u, owner) == false and GetWidgetLife(u) > 0.405 and IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) == false then
                            UnitDamageTarget(caster, u, data.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_DIVINE, WEAPON_TYPE_WHOKNOWS)
                            DestroyEffect(
                                AddSpecialEffectTarget(self.DamageSfx, u, "origin")
                            )
                        end
                        Dispel:DispelUnitTier1(u)
                        u = FirstOfGroup(SpellGroup)
                    end
                    SpellHelper:DummyCastPoint(owner, x, y, x, y, self.DummySpellId, level, self.DummyOrder)
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
Purge.DummySpellId = Dummies.Purge
Purge.DummyOrder = "dispel"
Purge.DamageSfx = "Abilities/Spells/Human/HolyBolt/HolyBoltSpecialArt.mdl"
Purge.Sfx = Models.SingularityOrange
Purge.CastSfx = Models.CastRepentance
return ____exports
