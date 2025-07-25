local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
require("Config")
____exports.PaladinMastery = {}
local PaladinMastery = ____exports.PaladinMastery
PaladinMastery.name = "PaladinMastery"
PaladinMastery.__index = PaladinMastery
PaladinMastery.prototype = {}
PaladinMastery.prototype.__index = PaladinMastery.prototype
PaladinMastery.prototype.constructor = PaladinMastery
function PaladinMastery.new(...)
    local self = setmetatable({}, PaladinMastery.prototype)
    self:____constructor(...)
    return self
end
function PaladinMastery.prototype.____constructor(self)
end
function PaladinMastery.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL)
    TriggerAddAction(
        t,
        function()
            local u = GetTriggerUnit()
            local spellId = GetLearnedSkill()
            if spellId ~= Spells.PaladinMastery then
                return
            end
            local level = GetLearnedSkillLevel() + 1
            if GetUnitAbilityLevel(u, Spells.PaladinRestoration) > 0 then
                SetUnitAbilityLevel(u, Spells.PaladinRestoration, level)
                SetUnitAbilityLevel(u, Spells.Rejuvenate, level)
                SetUnitAbilityLevel(u, Spells.Invigorate, level)
                SetUnitAbilityLevel(u, Spells.Redemption, level)
            elseif GetUnitAbilityLevel(u, Spells.PaladinDetermination) > 0 then
                SetUnitAbilityLevel(u, Spells.PaladinDetermination, level)
                SetUnitAbilityLevel(u, Spells.Bless, level)
                SetUnitAbilityLevel(u, Spells.Endure, level)
                SetUnitAbilityLevel(u, Spells.GuardianAngel, level)
            elseif GetUnitAbilityLevel(u, Spells.PaladinRepentance) > 0 then
                SetUnitAbilityLevel(u, Spells.PaladinRepentance, level)
                SetUnitAbilityLevel(u, Spells.Purge, level)
                SetUnitAbilityLevel(u, Spells.Justice, level)
                SetUnitAbilityLevel(u, Spells.Exorcism, level)
            end
        end
    )
    SpellEvent:RegisterSpellEffect(
        Spells.PalLearnRestoration,
        function()
            local u = GetTriggerUnit()
            local lvl = GetUnitAbilityLevel(u, Spells.PaladinMastery) + 1
            UnitRemoveAbility(u, Spells.PaladinLearnMastery)
            UnitAddAbility(u, Spells.PaladinRestoration)
            SetUnitAbilityLevel(u, Spells.PaladinRestoration, lvl)
            SetUnitAbilityLevel(u, Spells.Rejuvenate, lvl)
            SetUnitAbilityLevel(u, Spells.Invigorate, lvl)
            SetUnitAbilityLevel(u, Spells.Redemption, lvl)
        end
    )
    SpellEvent:RegisterSpellEffect(
        Spells.PalLearnDetermination,
        function()
            local u = GetTriggerUnit()
            local lvl = GetUnitAbilityLevel(u, Spells.PaladinMastery) + 1
            UnitRemoveAbility(u, Spells.PaladinLearnMastery)
            UnitAddAbility(u, Spells.PaladinDetermination)
            SetUnitAbilityLevel(u, Spells.PaladinDetermination, lvl)
            SetUnitAbilityLevel(u, Spells.Bless, lvl)
            SetUnitAbilityLevel(u, Spells.Endure, lvl)
            SetUnitAbilityLevel(u, Spells.GuardianAngel, lvl)
        end
    )
    SpellEvent:RegisterSpellEffect(
        Spells.PalLearnRepentance,
        function()
            local u = GetTriggerUnit()
            local lvl = GetUnitAbilityLevel(u, Spells.PaladinMastery) + 1
            UnitRemoveAbility(u, Spells.PaladinLearnMastery)
            UnitAddAbility(u, Spells.PaladinRepentance)
            SetUnitAbilityLevel(u, Spells.PaladinRepentance, lvl)
            SetUnitAbilityLevel(u, Spells.Purge, lvl)
            SetUnitAbilityLevel(u, Spells.Justice, lvl)
            SetUnitAbilityLevel(u, Spells.Exorcism, lvl)
        end
    )
end
return ____exports
