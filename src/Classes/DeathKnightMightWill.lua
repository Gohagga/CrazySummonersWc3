local ____exports = {}
require("Config")
____exports.DeathKnightMightWill = {}
local DeathKnightMightWill = ____exports.DeathKnightMightWill
DeathKnightMightWill.name = "DeathKnightMightWill"
DeathKnightMightWill.__index = DeathKnightMightWill
DeathKnightMightWill.prototype = {}
DeathKnightMightWill.prototype.__index = DeathKnightMightWill.prototype
DeathKnightMightWill.prototype.constructor = DeathKnightMightWill
function DeathKnightMightWill.new(...)
    local self = setmetatable({}, DeathKnightMightWill.prototype)
    self:____constructor(...)
    return self
end
function DeathKnightMightWill.prototype.____constructor(self)
end
function DeathKnightMightWill.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL)
    TriggerAddAction(
        t,
        function()
            local spellId = GetLearnedSkill()
            if spellId ~= Spells.DeathKnightMight and spellId ~= Spells.DeathKnightWill then
                return
            end
            local u = GetTriggerUnit()
            local might = GetUnitAbilityLevel(u, Spells.DeathKnightMight)
            local will = GetUnitAbilityLevel(u, Spells.DeathKnightWill)
            local mix = 1 + will * 4 + might
            if spellId == Spells.DeathKnightMight then
                SetUnitAbilityLevel(u, Spells.VolatileLeeches, might + 1)
                SetUnitAbilityLevel(u, Spells.DeathVolley, might + 1)
                SetUnitAbilityLevel(u, Spells.DeathsEmbrace, might + 1)
                SetUnitAbilityLevel(u, Spells.VampiresBoon, mix)
                SetUnitAbilityLevel(u, Spells.UnholyCurse, mix)
                SetUnitAbilityLevel(u, Spells.ArmyOfTheDead, mix)
            elseif spellId == Spells.DeathKnightWill then
                SetUnitAbilityLevel(u, Spells.CorruptedBlood, will + 1)
                SetUnitAbilityLevel(u, Spells.AntimagicZone, will + 1)
                SetUnitAbilityLevel(u, Spells.DeathAndDecay, will + 1)
                SetUnitAbilityLevel(u, Spells.VampiresBoon, mix)
                SetUnitAbilityLevel(u, Spells.UnholyCurse, mix)
                SetUnitAbilityLevel(u, Spells.ArmyOfTheDead, mix)
            end
        end
    )
end
return ____exports
