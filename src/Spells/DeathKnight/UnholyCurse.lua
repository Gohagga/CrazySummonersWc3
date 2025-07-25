local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local OrbCostToString = ____Orb.OrbCostToString
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
require("Config")
____exports.UnholyCurse = {}
local UnholyCurse = ____exports.UnholyCurse
UnholyCurse.name = "UnholyCurse"
UnholyCurse.__index = UnholyCurse
UnholyCurse.prototype = {}
UnholyCurse.prototype.__index = UnholyCurse.prototype
UnholyCurse.prototype.constructor = UnholyCurse
function UnholyCurse.new(...)
    local self = setmetatable({}, UnholyCurse.prototype)
    self:____constructor(...)
    return self
end
function UnholyCurse.prototype.____constructor(self)
end
function UnholyCurse.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Red, OrbType.Purple}
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local might = math.fmod((level - 1), 4)
            local will = math.floor((level - 1) / 4)
            local data = {
                done = false,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "chest"),
                damage = ({1, 2, 2, 3})[might + 1],
                duration = ({120, 100, 80, 60})[will + 1],
                castTime = 2,
                timer = CreateTimer()
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2)
            print(data.duration, data.damage)
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
                    SpellHelper:DummyCastTarget(
                        owner,
                        GetUnitX(caster),
                        GetUnitY(caster),
                        target,
                        self.DummySpellId,
                        1,
                        self.DummyOrder
                    )
                    TimerStart(
                        data.timer,
                        data.duration,
                        false,
                        function()
                            if GetUnitAbilityLevel(target, self.Buff) then
                                UnitRemoveAbility(target, self.Buff)
                                if UnitTypeFlags:IsUnitUndead(target) then
                                    SetWidgetLife(
                                        target,
                                        GetWidgetLife(target) + data.damage
                                    )
                                else
                                    UnitDamageTarget(caster, target, data.damage, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                                end
                            end
                            PauseTimer(data.timer)
                            DestroyTimer(data.timer)
                        end
                    )
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if not data.done then
                        DestroyEffect(data.castSfx)
                        PauseTimer(data.timer)
                        DestroyTimer(data.timer)
                        cb:Destroy()
                        data.done = true
                    end
                    return false
                end
            )
        end
    )
    do
        local i = 0
        while i < 16 do
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
UnholyCurse.DummySpellId = Dummies.UnholyCurse
UnholyCurse.DummyOrder = "cripple"
UnholyCurse.Buff = Buffs.UnholyCurse
UnholyCurse.Sfx = "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdl"
UnholyCurse.TargetSfx = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl"
UnholyCurse.CastSfx = Models.CastUnholy
UnholyCurse.OrbCost = {}
return ____exports
