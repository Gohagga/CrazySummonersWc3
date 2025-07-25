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
____exports.Endure = {}
local Endure = ____exports.Endure
Endure.name = "Endure"
Endure.__index = Endure
Endure.prototype = {}
Endure.prototype.__index = Endure.prototype
Endure.prototype.constructor = Endure
function Endure.new(...)
    local self = setmetatable({}, Endure.prototype)
    self:____constructor(...)
    return self
end
function Endure.prototype.____constructor(self)
end
function Endure.init(self, spellId)
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
                aoe = ({250, 250, 400, 550})[level],
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = ({2, 1, 1, 1})[level]
            }
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.White, OrbType.White, OrbType.Purple}) then
                        return
                    end
                    local sfx = AddSpecialEffect(self.Sfx, x, y)
                    BlzSetSpecialEffectScale(sfx, 0.0045 * data.aoe)
                    DestroyEffect(sfx)
                    GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, nil)
                    local u = FirstOfGroup(SpellGroup)
                    while u ~= nil do
                        GroupRemoveUnit(SpellGroup, u)
                        SpellHelper:DummyCastTarget(owner, x, y, u, self.DummySpellId, level, self.DummyOrder)
                        u = FirstOfGroup(SpellGroup)
                    end
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
Endure.DummySpellId = Dummies.Endure
Endure.DummyOrder = "frostarmor"
Endure.Sfx = "Abilities\\Spells\\NightElf\\Taunt\\TauntCaster.mdl"
Endure.CastSfx = Models.CastDetermination
return ____exports
