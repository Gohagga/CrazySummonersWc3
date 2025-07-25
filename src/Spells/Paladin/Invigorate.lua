local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
require("Config")
____exports.Invigorate = {}
local Invigorate = ____exports.Invigorate
Invigorate.name = "Invigorate"
Invigorate.__index = Invigorate
Invigorate.prototype = {}
Invigorate.prototype.__index = Invigorate.prototype
Invigorate.prototype.constructor = Invigorate
function Invigorate.new(...)
    local self = setmetatable({}, Invigorate.prototype)
    self:____constructor(...)
    return self
end
function Invigorate.prototype.____constructor(self)
end
function Invigorate.init(self, spellId)
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
                aoe = ({200, 200, 350, 500})[level],
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = ({2, 2, 1.5, 1.2})[level]
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.Blue}) then
                        return
                    end
                    SpellHelper:DummyCastImmediate(owner, x, y, self.DummySpellId, level, self.DummyOrder)
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
Invigorate.DummySpellId = Dummies.Invigorate
Invigorate.DummyOrder = "roar"
Invigorate.Sfx = "Radiance Holy.mdl"
Invigorate.CastSfx = Models.CastRestoration
return ____exports
