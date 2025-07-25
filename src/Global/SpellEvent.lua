local ____exports = {}
____exports.SpellEvent = {}
local SpellEvent = ____exports.SpellEvent
SpellEvent.name = "SpellEvent"
SpellEvent.__index = SpellEvent
SpellEvent.prototype = {}
SpellEvent.prototype.__index = SpellEvent.prototype
SpellEvent.prototype.constructor = SpellEvent
function SpellEvent.new(...)
    local self = setmetatable({}, SpellEvent.prototype)
    self:____constructor(...)
    return self
end
function SpellEvent.prototype.____constructor(self)
end
function SpellEvent.RegisterSpellCast(self, spellId, callback)
    ____exports.SpellEvent.spellCastCallbacks[spellId + 1] = callback
end
function SpellEvent.RegisterSpellEffect(self, spellId, callback)
    ____exports.SpellEvent.spellEffectCallbacks[spellId + 1] = callback
end
function SpellEvent.RegisterSpellEnd(self, spellId, callback)
    ____exports.SpellEvent.spellEndCallbacks[spellId + 1] = callback
end
function SpellEvent.init(self)
    local tCast = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(tCast, EVENT_PLAYER_UNIT_SPELL_CAST)
    TriggerAddAction(
        tCast,
        function()
            if ____exports.SpellEvent.spellCastCallbacks[GetSpellAbilityId() + 1] then
                ____exports.SpellEvent.spellCastCallbacks[GetSpellAbilityId() + 1]()
            end
        end
    )
    local tEffect = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(tEffect, EVENT_PLAYER_UNIT_SPELL_EFFECT)
    TriggerAddAction(
        tEffect,
        function()
            if ____exports.SpellEvent.spellEffectCallbacks[GetSpellAbilityId() + 1] then
                ____exports.SpellEvent.spellEffectCallbacks[GetSpellAbilityId() + 1]()
            end
        end
    )
    local tEnd = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(tEnd, EVENT_PLAYER_UNIT_SPELL_ENDCAST)
    TriggerAddAction(
        tEnd,
        function()
            if ____exports.SpellEvent.spellEndCallbacks[GetSpellAbilityId() + 1] then
                ____exports.SpellEvent.spellEndCallbacks[GetSpellAbilityId() + 1]()
            end
        end
    )
end
SpellEvent.spellCastCallbacks = {}
SpellEvent.spellEffectCallbacks = {}
SpellEvent.spellEndCallbacks = {}
return ____exports
