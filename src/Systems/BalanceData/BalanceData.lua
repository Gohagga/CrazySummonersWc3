local ____exports = {}
____exports.BalanceData = {}
local BalanceData = ____exports.BalanceData
BalanceData.name = "BalanceData"
BalanceData.__index = BalanceData
BalanceData.prototype = {}
BalanceData.prototype.__index = BalanceData.prototype
BalanceData.prototype.constructor = BalanceData
function BalanceData.new(...)
    local self = setmetatable({}, BalanceData.prototype)
    self:____constructor(...)
    return self
end
function BalanceData.prototype.____constructor(self, maxLevel, secondsToDie, maxToMinRelativeValue, minEffectiveHp, maxEffectiveHp)
    self.maxLevel = maxLevel
    self.secondsToDie = secondsToDie
    self.maxToMinRelativeValue = maxToMinRelativeValue
    self.minEhp = minEffectiveHp
    self.minDps = minEffectiveHp / secondsToDie
    local hpDiff = maxEffectiveHp - minEffectiveHp
    self.ehpPerLevel = hpDiff / maxLevel
    self.dpsPerLevel = hpDiff / secondsToDie / maxLevel
end
function BalanceData.prototype.Calculate(self, level, offenseRatio, defenseRatio, attack, defense)
    local avgDps = (self.minDps + (level - 1) * self.dpsPerLevel) * offenseRatio
    local avgDpr = avgDps * attack.speed * attack.targetsMultiplier / attack.targetsCount
    local diceCount = math.floor((avgDpr + attack.diceTweaks[2]) / (attack.diceTweaks[1] + avgDps * attack.diceTweaks[3]) + 0.5)
    local diceMaxRoll = math.floor(avgDpr * attack.dpsVariation / diceCount + 0.5)
    local diceDpr = (diceMaxRoll + 1) * 0.5 * diceCount
    local baseDamage = avgDpr - diceDpr
    local ehp = (self.minEhp + (level - 1) * self.ehpPerLevel) * defenseRatio
    local armor = math.floor((defense.armorRatio + defense.armorGrowth * (level - 1)) / (0.06 * (1 - defense.armorRatio)) + 0.5)
    local absorbRatio = (armor * 0.06) / (1 + 0.06 * armor)
    local hitPoints = ehp * (1 - absorbRatio)
    return {baseDamage = baseDamage, diceCount = diceCount, diceMaxRoll = diceMaxRoll, hitPoints = hitPoints, armor = armor}
end
return ____exports
