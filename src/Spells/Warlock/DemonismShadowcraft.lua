local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____Order = require("Global.Order")
local Order = ____Order.Order
require("Config")
____exports.DemonismShadowcraft = {}
local DemonismShadowcraft = ____exports.DemonismShadowcraft
DemonismShadowcraft.name = "DemonismShadowcraft"
DemonismShadowcraft.__index = DemonismShadowcraft
DemonismShadowcraft.prototype = {}
DemonismShadowcraft.prototype.__index = DemonismShadowcraft.prototype
DemonismShadowcraft.prototype.constructor = DemonismShadowcraft
function DemonismShadowcraft.new(...)
    local self = setmetatable({}, DemonismShadowcraft.prototype)
    self:____constructor(...)
    return self
end
function DemonismShadowcraft.prototype.____constructor(self)
end
function DemonismShadowcraft.AddDemonism(self, caster)
    local level = GetUnitAbilityLevel(caster, self.SpellId)
    UnitAddAbility(caster, Auras.Demonism)
    SetUnitAbilityLevel(caster, Auras.Demonism, level)
    if level > 2 then
        self:SwitchSpellLevels(
            caster,
            math.floor(level / 3) + 1,
            Buffs.Demonism
        )
    end
end
function DemonismShadowcraft.SwitchSpellLevels(self, caster, level, modeBuffId)
    local demo = 1
    local shadow = 1
    if modeBuffId == Buffs.Demonism then
        demo = level
    elseif modeBuffId == Buffs.Shadowcraft then
        shadow = level
    end
    SetUnitAbilityLevel(caster, Spells.CrazyImp, demo)
    SetUnitAbilityLevel(caster, Spells.DarkPortal, demo)
    SetUnitAbilityLevel(caster, Spells.ContagiousInsanity, shadow)
    SetUnitAbilityLevel(caster, Spells.StealEssence, shadow)
end
function DemonismShadowcraft.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            if GetUnitAbilityLevel(caster, Auras.Shadowcraft) > 0 then
                UnitAddAbility(caster, Auras.Demonism)
                SetUnitAbilityLevel(caster, Auras.Demonism, level)
                if level > 2 then
                    self:SwitchSpellLevels(
                        caster,
                        math.floor(level / 3) + 1,
                        Buffs.Demonism
                    )
                end
            else
                UnitRemoveAbility(caster, Auras.Demonism)
                UnitRemoveAbility(caster, Buffs.Demonism)
                if level > 2 then
                    self:SwitchSpellLevels(
                        caster,
                        math.floor(level / 3) + 1,
                        Buffs.Shadowcraft
                    )
                end
            end
        end
    )
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_ORDER)
    TriggerAddCondition(
        t,
        Condition(
            function() return GetIssuedOrderId() == Order.UNIMMOLATION and GetUnitAbilityLevel(
                GetTriggerUnit(),
                self.SpellId
            ) > 0 end
        )
    )
    TriggerAddAction(
        t,
        function() return self:AddDemonism(
            GetTriggerUnit()
        ) end
    )
    t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_SKILL)
    TriggerAddCondition(
        t,
        Condition(
            function() return GetLearnedSkill() == self.SpellId and GetLearnedSkillLevel() == 1 end
        )
    )
    TriggerAddAction(
        t,
        function() return self:AddDemonism(
            GetTriggerUnit()
        ) end
    )
end
return ____exports
