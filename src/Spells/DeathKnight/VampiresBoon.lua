local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local OrbCostToString = ____Orb.OrbCostToString
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.VampiresBoon = {}
local VampiresBoon = ____exports.VampiresBoon
VampiresBoon.name = "VampiresBoon"
VampiresBoon.__index = VampiresBoon
VampiresBoon.prototype = {}
VampiresBoon.prototype.__index = VampiresBoon.prototype
VampiresBoon.prototype.constructor = VampiresBoon
function VampiresBoon.new(...)
    local self = setmetatable({}, VampiresBoon.prototype)
    self:____constructor(...)
    return self
end
function VampiresBoon.prototype.____constructor(self)
end
function VampiresBoon.Filter(self, target, owner)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and IsUnitAlly(target, owner) and (GetWidgetLife(target) > 0.405)
end
function VampiresBoon.init(self, spellId)
    self.SpellId = spellId
    self.OrbCost = {OrbType.Red, OrbType.Red, OrbType.Purple}
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local x = GetRectCenterX(gg_rct_Battleground)
            local y = GetRectCenterY(gg_rct_Battleground)
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local might = math.fmod((level - 1), 4)
            local will = math.floor((level - 1) / 4)
            print(might)
            local data = {
                done = false,
                duration = 6 + 2 * will,
                auraLevel = might + 1,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 2.5
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
                    local dummy = CreateUnit(owner, Units.NegativeZDummy, x, y, 0)
                    UnitAddAbility(dummy, self.Aura)
                    SetUnitAbilityLevel(dummy, self.Aura, data.auraLevel)
                    UnitApplyTimedLife(
                        dummy,
                        FourCC("B000"),
                        data.duration
                    )
                    SetUnitScale(dummy, 10, 10, 1)
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
VampiresBoon.CastSfx = Models.CastSacrifice
VampiresBoon.Aura = Auras.VampiresBoon
VampiresBoon.OrbCost = {}
return ____exports
