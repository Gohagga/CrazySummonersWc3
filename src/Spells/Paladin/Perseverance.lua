local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
require("Config")
____exports.Perseverance = {}
local Perseverance = ____exports.Perseverance
Perseverance.name = "Perseverance"
Perseverance.__index = Perseverance
Perseverance.prototype = {}
Perseverance.prototype.__index = Perseverance.prototype
Perseverance.prototype.constructor = Perseverance
function Perseverance.new(...)
    local self = setmetatable({}, Perseverance.prototype)
    self:____constructor(...)
    return self
end
function Perseverance.prototype.____constructor(self)
end
function Perseverance.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellEffect(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local hp = GetWidgetLife(target)
            local data = {maxLifeBonus = 34 + level, healing = 2}
            if GetUnitState(target, UNIT_STATE_MAX_LIFE) < data.maxLifeBonus then
                UnitAddAbility(target, self.Aura)
                SetUnitAbilityLevel(target, self.Aura, 2)
                UnitRemoveAbility(target, self.Aura)
                SetWidgetLife(target, hp)
            elseif UnitTypeFlags:IsUnitUndead(target) then
                UnitDamageTarget(caster, target, data.healing, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
            else
                SetWidgetLife(target, hp + 2)
            end
        end
    )
end
Perseverance.Aura = Auras.Perseverance
return ____exports
