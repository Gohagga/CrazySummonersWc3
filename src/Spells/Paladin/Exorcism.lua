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
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
require("Config")
____exports.Exorcism = {}
local Exorcism = ____exports.Exorcism
Exorcism.name = "Exorcism"
Exorcism.__index = Exorcism
Exorcism.prototype = {}
Exorcism.prototype.__index = Exorcism.prototype
Exorcism.prototype.constructor = Exorcism
function Exorcism.new(...)
    local self = setmetatable({}, Exorcism.prototype)
    self:____constructor(...)
    return self
end
function Exorcism.prototype.____constructor(self)
    self.lifeCostPerTick = 0
    self.killsPerTick = 0
    self.buffer = 0
end
function Exorcism.Filter(self, target, owner)
    return (UnitTypeFlags:IsUnitDemon(target) or UnitTypeFlags:IsUnitHorror(target) or UnitTypeFlags:IsUnitUndead(target)) and (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and (GetWidgetLife(target) > 0.405)
end
function Exorcism.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetRectCenterX(gg_rct_Battleground)
            local y = GetRectCenterY(gg_rct_Battleground)
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.Red, OrbType.Purple}) then
                return
            end
            local data = {
                minimumHealth = 4,
                hpPerTick = ({1, 0.5, 0.25, 0})[level],
                hitsPerTick = 1 + math.floor(level * 0.5),
                hitBuffer = 0,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 10,
                tickDuration = 1,
                damage = 800,
                timer = CreateTimer()
            }
            TimerStart(
                data.timer,
                data.tickDuration,
                true,
                function()
                    local unitWasKilled = false
                    if data.hitBuffer <= 0 then
                        data.hitBuffer = data.hitBuffer + data.hitsPerTick
                    end
                    GroupEnumUnitsInRect(SpellGroup, gg_rct_Battleground, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil and data.hitBuffer > 0 do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:Filter(u, owner) then
                            DestroyEffect(
                                AddSpecialEffectLoc(
                                    self.DamageSfx,
                                    GetUnitLoc(u)
                                )
                            )
                            UnitApplyTimedLife(
                                u,
                                FourCC("B000"),
                                0.6
                            )
                            DestroyEffect(
                                AddSpecialEffectTarget(self.KillSfx, u, "chest")
                            )
                            unitWasKilled = true
                            data.hitBuffer = data.hitBuffer - 1
                        end
                        u = FirstOfGroup(SpellGroup)
                    end
                    if unitWasKilled then
                        UnitDamageTarget(caster, caster, data.hpPerTick, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                    end
                    if GetWidgetLife(caster) < data.minimumHealth then
                        IssueImmediateOrder(caster, "stop")
                    end
                end
            )
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    PauseTimer(data.timer)
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if data then
                        DestroyEffect(data.castSfx)
                        cb:Destroy()
                        PauseTimer(data.timer)
                        IssueImmediateOrder(caster, "stop")
                    end
                    return false
                end
            )
        end
    )
end
Exorcism.Aura = Auras.GuardianAngel
Exorcism.AuraReincarnation = Auras.Reincarnation
Exorcism.KillSfx = "Abilities\\Spells\\Human\\DivineShield\\DivineShieldTarget.mdl"
Exorcism.DamageSfx = "Abilities\\Spells\\Human\\Resurrect\\ResurrectTarget.mdl"
Exorcism.CastSfx = Models.CastRepentance
return ____exports
