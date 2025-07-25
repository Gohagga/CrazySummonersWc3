local ____exports = {}
local ____BloodFeast = require("Spells.Warlock.BloodFeast")
local BloodFeast = ____BloodFeast.BloodFeast
local ____CorruptedBlood = require("Spells.DeathKnight.CorruptedBlood")
local CorruptedBlood = ____CorruptedBlood.CorruptedBlood
require("Config")
____exports.Dispel = {}
local Dispel = ____exports.Dispel
Dispel.name = "Dispel"
Dispel.__index = Dispel
Dispel.prototype = {}
Dispel.prototype.__index = Dispel.prototype
Dispel.prototype.constructor = Dispel
function Dispel.new(...)
    local self = setmetatable({}, Dispel.prototype)
    self:____constructor(...)
    return self
end
function Dispel.prototype.____constructor(self)
end
function Dispel.DispelUnitTier1(self, u)
    UnitRemoveAbility(u, BloodFeast.AuraDamage)
    CorruptedBlood:RemoveBuff(u)
end
return ____exports
