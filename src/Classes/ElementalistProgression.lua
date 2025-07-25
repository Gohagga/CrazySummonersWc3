local ____exports = {}
local ____HeroProgression = require("Systems.HeroProgression")
local HeroProgression = ____HeroProgression.HeroProgression
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____DelayFunction = require("Global.DelayFunction")
local DelayFunction = ____DelayFunction.DelayFunction
____exports.ElementalistProgression = {}
local ElementalistProgression = ____exports.ElementalistProgression
ElementalistProgression.name = "ElementalistProgression"
ElementalistProgression.__index = ElementalistProgression
ElementalistProgression.prototype = {}
ElementalistProgression.prototype.__index = ElementalistProgression.prototype
ElementalistProgression.prototype.constructor = ElementalistProgression
ElementalistProgression.____super = HeroProgression
setmetatable(ElementalistProgression, ElementalistProgression.____super)
setmetatable(ElementalistProgression.prototype, ElementalistProgression.____super.prototype)
function ElementalistProgression.new(...)
    local self = setmetatable({}, ElementalistProgression.prototype)
    self:____constructor(...)
    return self
end
function ElementalistProgression.prototype.____constructor(self, unit)
    HeroProgression.prototype.____constructor(self, unit)
end
function ElementalistProgression.prototype.ProgressFunction(self, unit)
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
            bar:AddOrb(OrbType.Red)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Blue)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Purple)
        end
    )
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 3
    )
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
