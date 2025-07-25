local ____exports = {}
local ____HeroProgression = require("Systems.HeroProgression")
local HeroProgression = ____HeroProgression.HeroProgression
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____DelayFunction = require("Global.DelayFunction")
local DelayFunction = ____DelayFunction.DelayFunction
local ____RedPower = require("Spells.DeathKnight.RedPower")
local RedPower = ____RedPower.RedPower
____exports.DeathKnightProgression = {}
local DeathKnightProgression = ____exports.DeathKnightProgression
DeathKnightProgression.name = "DeathKnightProgression"
DeathKnightProgression.__index = DeathKnightProgression
DeathKnightProgression.prototype = {}
DeathKnightProgression.prototype.__index = DeathKnightProgression.prototype
DeathKnightProgression.prototype.constructor = DeathKnightProgression
DeathKnightProgression.____super = HeroProgression
setmetatable(DeathKnightProgression, DeathKnightProgression.____super)
setmetatable(DeathKnightProgression.prototype, DeathKnightProgression.____super.prototype)
function DeathKnightProgression.new(...)
    local self = setmetatable({}, DeathKnightProgression.prototype)
    self:____constructor(...)
    return self
end
function DeathKnightProgression.prototype.____constructor(self, unit)
    HeroProgression.prototype.____constructor(self, unit)
end
function DeathKnightProgression.prototype.ProgressFunction(self, unit)
    local owner = GetOwningPlayer(unit)
    local bar = ResourceBar:Get(owner)
    DelayFunction:SmoothRun(
        0.2,
        function()
            bar:AddOrb(OrbType.Summoning)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Summoning)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Summoning)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Red)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Red)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Red)
        end
    )
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    UnitAddAbility(unit, Spells.SummonGhoul)
    UnitAddAbility(unit, Spells.RedPower)
    local rps = UnitAddItemById(unit, Items.RedPowerStacks)
    RedPower:StartChargeUp(rps)
    HeroProgression:WaitForUnitLevel(self.unit, 3)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 5)
    bar:AddOrb(OrbType.Red)
    HeroProgression:WaitForUnitLevel(self.unit, 6)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 7)
    SetPlayerTechResearched(
        GetOwningPlayer(unit),
        Upgrades.SpellCircle,
        1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 9)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 10)
    bar:AddOrb(OrbType.Red)
    HeroProgression:WaitForUnitLevel(self.unit, 11)
    SetPlayerTechResearched(
        GetOwningPlayer(unit),
        Upgrades.SpellCircle,
        2
    )
    HeroProgression:WaitForUnitLevel(self.unit, 13)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 15)
    bar:AddOrb(OrbType.Red)
    HeroProgression:WaitForUnitLevel(self.unit, 16)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 19)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
end
return ____exports
