local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____Spawn = require("Spells.Spawn")
local SpawnPoint = ____Spawn.SpawnPoint
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____ProgressBars = require("Global.ProgressBars")
local CastBar = ____ProgressBars.CastBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____WardSpell = require("Systems.WardSpell")
local WardSpell = ____WardSpell.WardSpell
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
require("Config")
____exports.DarkPortal = {}
local DarkPortal = ____exports.DarkPortal
DarkPortal.name = "DarkPortal"
DarkPortal.__index = DarkPortal
DarkPortal.prototype = {}
DarkPortal.prototype.__index = DarkPortal.prototype
DarkPortal.prototype.constructor = DarkPortal
DarkPortal.____super = WardSpell
setmetatable(DarkPortal, DarkPortal.____super)
setmetatable(DarkPortal.prototype, DarkPortal.____super.prototype)
function DarkPortal.new(...)
    local self = setmetatable({}, DarkPortal.prototype)
    self:____constructor(...)
    return self
end
function DarkPortal.prototype.____constructor(self, darkPortal, spawnPoint)
    WardSpell.prototype.____constructor(self)
    self.unit = darkPortal
    self.spawnPoint = spawnPoint
    self.timer = CreateTimer()
    self.onDestroy = function()
        self:Destroy()
    end
end
function DarkPortal.prototype.Destroy(self)
    KillUnit(self.unit)
    PauseTimer(self.timer)
    DestroyTimer(self.timer)
end
function DarkPortal.UnitAI(self, data)
    if GetUnitCurrentOrder(data.unit) == 0 then
        local x = GetLocationX(data.destination)
        local y = GetLocationY(data.destination)
        IssuePointOrderLoc(data.unit, "attack", data.destination)
    end
end
function DarkPortal.init(self, spellId)
    self.SpellId = spellId
    SpellEvent:RegisterSpellCast(
        self.SpellId,
        function()
            local caster = GetTriggerUnit()
            local owner = GetOwningPlayer(caster)
            local target = GetSpellTargetUnit()
            local level = GetUnitAbilityLevel(caster, self.SpellId)
            local wt = WardSpell:FromTarget(target)
            local sp = SpawnPoint:FromTarget(target)
            if not wt or not sp then
                return
            end
            local unitType = self.UnitSpawned[level]
            local data = {
                unitType = unitType,
                castTime = 4 - 0.5 * level,
                duration = 20 + level * 10,
                manaRequired = 9.8,
                sp = sp,
                castSfx = AddSpecialEffect(
                    self.CastSfx,
                    GetUnitX(caster),
                    GetUnitY(caster)
                )
            }
            BlzSetSpecialEffectScale(data.castSfx, 2)
            local cb = CastBar.new(caster)
            cb:CastSpell(
                self.SpellId,
                data.castTime,
                function()
                    cb:Finish()
                    DestroyEffect(data.castSfx)
                    if not ResourceBar:Get(owner):Consume({OrbType.Purple, OrbType.Purple, OrbType.Red, OrbType.Summoning}) then
                        return
                    end
                    local darkPortal = CreateUnitAtLoc(
                        sp.owner,
                        self.UnitId,
                        data.sp:GetPolarOffsetPoint(data.sp.facing, 140),
                        data.sp.facing
                    )
                    UnitAddAbility(darkPortal, self.AuraHp)
                    SetUnitAbilityLevel(darkPortal, self.AuraHp, level)
                    UnitRemoveAbility(darkPortal, self.AuraHp)
                    local spawnPoint = SpawnPoint:RegisterSpawnPointTarget(darkPortal, data.sp.owner)
                    spawnPoint:SetDestination(sp.Destination)
                    spawnPoint:SetSpawnPointPolarOffset(data.sp.facing, 100)
                    local ward = ____exports.DarkPortal.new(darkPortal, spawnPoint)
                    WardSpell:ApplyWard(target, ward)
                    UnitApplyTimedLife(
                        darkPortal,
                        FourCC("B000"),
                        data.duration
                    )
                    data.unit = darkPortal
                    TimerStart(
                        ward.timer,
                        0.5,
                        true,
                        function()
                            if GetUnitState(darkPortal, UNIT_STATE_MANA) >= data.manaRequired then
                                ResourceBar:Get(owner):ForceCast(
                                    function()
                                        SpellHelper:DummyCastTarget(
                                            owner,
                                            GetUnitX(darkPortal),
                                            GetUnitY(darkPortal),
                                            darkPortal,
                                            Spells.SummonEvilOutsider,
                                            level,
                                            "acidbomb"
                                        )
                                        SetUnitState(darkPortal, UNIT_STATE_MANA, 0)
                                    end
                                )
                            elseif GetWidgetLife(darkPortal) <= 0.405 then
                                ward:Destroy()
                            end
                        end
                    )
                    IssueImmediateOrder(caster, "stop")
                    QueueUnitAnimation(caster, "spell")
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
DarkPortal.AuraHp = Auras.DarkPortalLifeBonus
DarkPortal.CastSfx = Models.CastSummoning
DarkPortal.Sfx = Models.CastSummoning
DarkPortal.UnitId = Units.DarkPortal
DarkPortal.UnitSpawned = {Units.CrazyImp1, Units.CrazyImp2, Units.CrazyImp3, Units.CrazyImp4}
return ____exports
