local ____exports = {}
____exports.HeroStats = {}
local HeroStats = ____exports.HeroStats
HeroStats.name = "HeroStats"
HeroStats.__index = HeroStats
HeroStats.prototype = {}
HeroStats.prototype.__index = HeroStats.prototype
HeroStats.prototype.constructor = HeroStats
function HeroStats.new(...)
    local self = setmetatable({}, HeroStats.prototype)
    self:____constructor(...)
    return self
end
function HeroStats.prototype.____constructor(self, unit)
    self.unitId = GetHandleId(unit)
end
function HeroStats.From(self, unit)
    return ____exports.HeroStats.new(unit)
end
function HeroStats.prototype.Crit(self, set)
    if not (____exports.HeroStats._crit[self.unitId] ~= nil) then
        ____exports.HeroStats._crit[self.unitId] = ____exports.HeroStats.defaultCrit
    end
    if set then
        do
            local ____obj, ____index = ____exports.HeroStats._crit, self.unitId
            ____obj[____index] = ____obj[____index] + (set * 0.01)
        end
    end
    return ____exports.HeroStats._crit[self.unitId]
end
function HeroStats.prototype.CritDamage(self, set)
    if not (____exports.HeroStats._critDamage[self.unitId] ~= nil) then
        ____exports.HeroStats._critDamage[self.unitId] = ____exports.HeroStats.defaultCritDamage
    end
    if set then
        do
            local ____obj, ____index = ____exports.HeroStats._critDamage, self.unitId
            ____obj[____index] = ____obj[____index] + (set * 0.01)
        end
    end
    return ____exports.HeroStats._critDamage[self.unitId]
end
function HeroStats.prototype.Haste(self, set)
    if not (____exports.HeroStats._haste[self.unitId] ~= nil) then
        ____exports.HeroStats._haste[self.unitId] = ____exports.HeroStats.defaultHaste
    end
    if set then
        do
            local ____obj, ____index = ____exports.HeroStats._haste, self.unitId
            ____obj[____index] = ____obj[____index] + (set * 0.01)
        end
    end
    return ____exports.HeroStats._haste[self.unitId]
end
function HeroStats.prototype.Mastery(self, set)
    if not (____exports.HeroStats._mastery[self.unitId] ~= nil) then
        ____exports.HeroStats._mastery[self.unitId] = ____exports.HeroStats.defaultMastery
    end
    if set then
        do
            local ____obj, ____index = ____exports.HeroStats._mastery, self.unitId
            ____obj[____index] = ____obj[____index] + set
        end
    end
    return ____exports.HeroStats._mastery[self.unitId]
end
function HeroStats.prototype.HealingTaken(self, set)
    if not (____exports.HeroStats._healingTaken[self.unitId] ~= nil) then
        ____exports.HeroStats._healingTaken[self.unitId] = ____exports.HeroStats.defaultHealingTaken
    end
    if set then
        do
            local ____obj, ____index = ____exports.HeroStats._healingTaken, self.unitId
            ____obj[____index] = ____obj[____index] + (set * 0.01)
        end
    end
    return ____exports.HeroStats._healingTaken[self.unitId]
end
function HeroStats.prototype.HealingDone(self, set)
    if not (____exports.HeroStats._healingDone[self.unitId] ~= nil) then
        ____exports.HeroStats._healingDone[self.unitId] = ____exports.HeroStats.defaultHealingDone
    end
    if set then
        do
            local ____obj, ____index = ____exports.HeroStats._healingDone, self.unitId
            ____obj[____index] = ____obj[____index] + (set * 0.01)
        end
    end
    return ____exports.HeroStats._healingDone[self.unitId]
end
function HeroStats.prototype.WithBonusCritDo(self, bonus, func)
    self:Crit(bonus)
    func()
    self:Crit(-bonus)
end
function HeroStats.prototype.WithBonusCritDamageDo(self, bonus, func)
    self:CritDamage(bonus)
    func()
    self:CritDamage(-bonus)
end
function HeroStats.prototype.WithBonusHasteDo(self, bonus, func)
    self:Haste(bonus)
    func()
    self:Haste(-bonus)
end
function HeroStats.prototype.WithBonusMasteryDo(self, bonus, func)
    self:Mastery(bonus)
    func()
    self:Mastery(-bonus)
end
function HeroStats.prototype.WithBonusHealingTakenDo(self, bonus, func)
    self:HealingTaken(bonus)
    func()
    self:HealingTaken(-bonus)
end
function HeroStats.prototype.WithBonusHealingDoneDo(self, bonus, func)
    self:HealingDone(bonus)
    func()
    self:HealingDone(-bonus)
end
function HeroStats.prototype.CritChance(self)
    if math.random() < self:Crit() then
        return self:CritDamage()
    end
    return 1
end
HeroStats._crit = {}
HeroStats._critDamage = {}
HeroStats._haste = {}
HeroStats._mastery = {}
HeroStats._healingTaken = {}
HeroStats._healingDone = {}
HeroStats.defaultCrit = 0.05
HeroStats.defaultCritDamage = 1.5
HeroStats.defaultHaste = 1
HeroStats.defaultMastery = 0
HeroStats.defaultHealingTaken = 1
HeroStats.defaultHealingDone = 1
return ____exports
