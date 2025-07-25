local ____exports = {}
____exports.SacrificeMastery = {}
local SacrificeMastery = ____exports.SacrificeMastery
SacrificeMastery.name = "SacrificeMastery"
SacrificeMastery.__index = SacrificeMastery
SacrificeMastery.prototype = {}
SacrificeMastery.prototype.__index = SacrificeMastery.prototype
SacrificeMastery.prototype.constructor = SacrificeMastery
function SacrificeMastery.new(...)
    local self = setmetatable({}, SacrificeMastery.prototype)
    self:____constructor(...)
    return self
end
function SacrificeMastery.prototype.____constructor(self)
end
function SacrificeMastery.init(self, spellId)
    self.SpellId = spellId
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL)
    TriggerAddAction(
        t,
        function()
            local u = GetTriggerUnit()
            local spellId = GetLearnedSkill()
            if spellId ~= self.SpellId then
                return
            end
            local level = GetLearnedSkillLevel() + 1
            SetUnitAbilityLevel(u, Spells.Taint, level)
            SetUnitAbilityLevel(u, Spells.RitualOfDeath, level)
            SetUnitAbilityLevel(u, Spells.BloodFeast, level)
        end
    )
end
return ____exports
