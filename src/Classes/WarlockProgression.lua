local ____exports = {}
local ____HeroProgression = require("Systems.HeroProgression")
local HeroProgression = ____HeroProgression.HeroProgression
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
local ____DelayFunction = require("Global.DelayFunction")
local DelayFunction = ____DelayFunction.DelayFunction
local ____DarkPower = require("Spells.Warlock.DarkPower")
local DarkPower = ____DarkPower.DarkPower
____exports.WarlockProgression = {}
local WarlockProgression = ____exports.WarlockProgression
WarlockProgression.name = "WarlockProgression"
WarlockProgression.__index = WarlockProgression
WarlockProgression.prototype = {}
WarlockProgression.prototype.__index = WarlockProgression.prototype
WarlockProgression.prototype.constructor = WarlockProgression
WarlockProgression.____super = HeroProgression
setmetatable(WarlockProgression, WarlockProgression.____super)
setmetatable(WarlockProgression.prototype, WarlockProgression.____super.prototype)
function WarlockProgression.new(...)
    local self = setmetatable({}, WarlockProgression.prototype)
    self:____constructor(...)
    return self
end
function WarlockProgression.prototype.____constructor(self, unit)
    HeroProgression.prototype.____constructor(self, unit)
end
function WarlockProgression.prototype.ProgressFunction(self, unit)
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
            bar:AddOrb(OrbType.Purple)
        end
    ):Then(
        0.2,
        function()
            bar:AddOrb(OrbType.Purple)
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
    UnitAddAbility(unit, Spells.SummonEvilOutsider)
    UnitAddAbility(unit, Spells.DarkPower)
    local wps = UnitAddItemById(unit, Items.DarkFocusBase)
    DarkPower:StartChargeUp(unit, wps)
    HeroProgression:WaitForUnitLevel(self.unit, 3)
    SetPlayerState(
        owner,
        PLAYER_STATE_RESOURCE_LUMBER,
        GetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER) + 1
    )
    HeroProgression:WaitForUnitLevel(self.unit, 5)
    bar:AddOrb(OrbType.Purple)
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
    bar:AddOrb(OrbType.Purple)
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
    bar:AddOrb(OrbType.Purple)
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
