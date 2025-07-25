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
____exports.Bless = {}
local Bless = ____exports.Bless
Bless.name = "Bless"
Bless.__index = Bless
Bless.prototype = {}
Bless.prototype.__index = Bless.prototype
Bless.prototype.constructor = Bless
function Bless.new(...)
    local self = setmetatable({}, Bless.prototype)
    self:____constructor(...)
    return self
end
function Bless.prototype.____constructor(self)
end
function Bless.init(self, spellId)
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
                aoe = 150 + 100 * level,
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
                    if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.Red}) then
                        return
                    end
                    GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
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
Bless.DummySpellId = Dummies.Bless
Bless.DummyOrder = "innerfire"
Bless.Sfx = "Radiance Holy.mdl"
Bless.CastSfx = Models.CastDetermination
return ____exports
