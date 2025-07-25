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
local ____UnitCharge = require("Systems.UnitCharge")
local UnitCharge = ____UnitCharge.UnitCharge
require("Config")
____exports.Paranoia = {}
local Paranoia = ____exports.Paranoia
Paranoia.name = "Paranoia"
Paranoia.__index = Paranoia
Paranoia.prototype = {}
Paranoia.prototype.__index = Paranoia.prototype
Paranoia.prototype.constructor = Paranoia
function Paranoia.new(...)
    local self = setmetatable({}, Paranoia.prototype)
    self:____constructor(...)
    return self
end
function Paranoia.prototype.____constructor(self)
end
function Paranoia.Filter(self, target, owner)
    return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and (IsUnitAlly(target, owner) == false) and (GetWidgetLife(target) > 0.405)
end
function Paranoia.init(self, spellId)
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
                aoe = 200 + 100 * level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = ({3, 2.5, 2, 1.5})[level]
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Purple, OrbType.Blue}) then
                        return
                    end
                    local sfx = AddSpecialEffect(self.Sfx, x, y)
                    BlzSetSpecialEffectScale(sfx, 0.005 * data.aoe)
                    DestroyEffect(sfx)
                    GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        if self:Filter(u, owner) then
                            SpellHelper:DummyCastTarget(owner, x, y, u, self.DummySpellId, level, self.DummyOrder)
                            local uc = UnitCharge:FromUnit(u)
                            IssuePointOrderLoc(u, "move", uc.origin)
                        end
                        SpellHelper:DummyCastTarget(owner, x, y, u, self.DummySpellId, level, self.DummyOrder)
                        u = FirstOfGroup(SpellGroup)
                    end
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
Paranoia.DummySpellId = Dummies.Paranoia
Paranoia.DummyOrder = "drunkenhaze"
Paranoia.Sfx = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlCaster.mdl"
Paranoia.CastSfx = Models.CastShadow
return ____exports
