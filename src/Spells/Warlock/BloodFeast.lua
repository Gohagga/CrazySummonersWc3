local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
require("Config")
____exports.BloodFeast = {}
local BloodFeast = ____exports.BloodFeast
BloodFeast.name = "BloodFeast"
BloodFeast.__index = BloodFeast
BloodFeast.prototype = {}
BloodFeast.prototype.__index = BloodFeast.prototype
BloodFeast.prototype.constructor = BloodFeast
function BloodFeast.new(...)
    local self = setmetatable({}, BloodFeast.prototype)
    self:____constructor(...)
    return self
end
function BloodFeast.prototype.____constructor(self, caster, lifePerTick, hpBonus, attack)
    self.lifePerTick = 0
    self.attackPerTick = 0
    self.minimumHealth = 4
    self.timer = CreateTimer()
    self.caster = caster
    self.owner = GetOwningPlayer(caster)
    self.lifePerTick = lifePerTick
    self.attackPerTick = attack
end
function BloodFeast.prototype.Run(self, interval)
    TimerStart(
        self.timer,
        interval,
        false,
        function()
            local unitWasBuffed = false
            GroupEnumUnitsInRect(SpellGroup, gg_rct_Battleground, nil)
            local u = FirstOfGroup(SpellGroup)
            while u ~= nil do
                GroupRemoveUnit(SpellGroup, u)
                if ____exports.BloodFeast:Filter(u, self.owner) then
                    ____exports.BloodFeast:BuffUnit(self, u)
                    unitWasBuffed = true
                end
                u = FirstOfGroup(SpellGroup)
            end
            if unitWasBuffed then
                UnitDamageTarget(self.caster, self.caster, 1, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
            end
            if GetWidgetLife(self.caster) < self.minimumHealth then
                IssueImmediateOrder(self.caster, "stop")
            end
            self:Run(2)
        end
    )
end
function BloodFeast.prototype.End(self)
    PauseTimer(self.timer)
    DestroyTimer(self.timer)
end
function BloodFeast.BuffUnit(self, bf, u)
    local stacks = 0
    local aLvl = GetUnitAbilityLevel(u, self.AuraDamage)
    local tLvl = 0
    if aLvl < 20 then
        stacks = math.floor((aLvl + 3) / 4)
        if stacks == 0 then
            UnitAddAbility(u, self.AuraDamage)
            tLvl = bf.attackPerTick
        elseif stacks < 5 then
            tLvl = math.floor(stacks * 4 + bf.attackPerTick)
        else
            tLvl = 16 + bf.attackPerTick
        end
        SetUnitAbilityLevel(u, self.AuraDamage, tLvl)
        if stacks == 5 then
            UnitAddAbility(u, self.AuraHp)
            SetUnitAbilityLevel(u, self.AuraHp, aLvl - 11)
            UnitRemoveAbility(u, self.AuraHp)
        end
        UnitAddAbility(u, self.AuraHp)
        SetUnitAbilityLevel(u, self.AuraHp, bf.lifePerTick)
        UnitRemoveAbility(u, self.AuraHp)
        DestroyEffect(
            AddSpecialEffectTarget(____exports.BloodFeast.TargetSfx, u, "origin")
        )
    end
    SetWidgetLife(
        u,
        GetWidgetLife(u) + 50 * bf.lifePerTick
    )
end
function BloodFeast.Filter(self, target, owner)
    return (UnitTypeFlags:IsUnitDemon(target) or UnitTypeFlags:IsUnitHorror(target)) and (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) and (GetWidgetLife(target) > 0.405)
end
function BloodFeast.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Purple, OrbType.Red, OrbType.Red}) then
                return
            end
            local data = {
                minimumHealth = 4,
                hpBonus = 1 + level,
                attackBonus = level,
                castSfx = AddSpecialEffectTarget(self.CastSfx, caster, "origin"),
                castTime = 10,
                tickDuration = 1,
                timer = CreateTimer()
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2)
            local bf = ____exports.BloodFeast.new(caster, data.hpBonus, data.hpBonus, data.attackBonus)
            bf:Run(1)
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    bf:End()
                end
            )
            Interruptable:Register(
                caster,
                function()
                    if data then
                        DestroyEffect(data.castSfx)
                        cb:Destroy()
                        bf:End()
                        IssueImmediateOrder(caster, "stop")
                    end
                    return false
                end
            )
        end
    )
end
BloodFeast.AuraHp = Auras.BloodFeastHpBonus
BloodFeast.AuraDamage = Auras.BloodFeastDamageBonus
BloodFeast.CasterSfx = "Abilities\\Spells\\Orc\\FeralSpirit\\feralspirittarget.mdl"
BloodFeast.TargetSfx = Models.MassTeleportDemon
BloodFeast.CastSfx = Models.CastSacrifice
return ____exports
