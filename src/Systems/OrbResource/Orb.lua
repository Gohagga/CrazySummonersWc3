require("lualib_bundle");
local ____exports = {}
local ____OrbView = require("Systems.OrbResource.OrbView")
local OrbView = ____OrbView.OrbView
____exports.OrbType = {}
____exports.OrbType.Blue = 0
____exports.OrbType[____exports.OrbType.Blue] = "Blue"
____exports.OrbType.White = 1
____exports.OrbType[____exports.OrbType.White] = "White"
____exports.OrbType.Red = 2
____exports.OrbType[____exports.OrbType.Red] = "Red"
____exports.OrbType.Purple = 3
____exports.OrbType[____exports.OrbType.Purple] = "Purple"
____exports.OrbType.Summoning = 4
____exports.OrbType[____exports.OrbType.Summoning] = "Summoning"
____exports.OrbType.Any = 5
____exports.OrbType[____exports.OrbType.Any] = "Any"
____exports.Orb = {}
local Orb = ____exports.Orb
Orb.name = "Orb"
Orb.____getters = {}
Orb.__index = Orb
Orb.prototype = {}
Orb.prototype.__index = Orb.prototype
Orb.prototype.constructor = Orb
setmetatable(Orb, {__index = __TS__ClassIndex})
function Orb.new(...)
    local self = setmetatable({}, Orb.prototype)
    self:____constructor(...)
    return self
end
function Orb.prototype.____constructor(self, ____type, index)
    self.cooldownRemaining = 0
    self.isAvailable = true
    self.enabledTexture = ""
    self.disabledTexture = ""
    self.upgradeId = -1
    self.tooltip = ""
    self.timer = CreateTimer()
    self.type = ____type
    local typeId = ____type
    self.enabledTexture = ____exports.Orb.Config.icon[typeId + 1]
    self.disabledTexture = ____exports.Orb.Config.disabled[typeId + 1]
    self.upgradeId = ____exports.Orb.Config.upgrade[typeId + 1]
    self.tooltip = ____exports.Orb.Config.tooltip[typeId + 1]
    self.index = index
    local orbView = OrbView.Orbs[self.index + 1]
    orbView.tooltipText:SetText(self.tooltip)
end
function Orb.____getters.Config(self)
    return {icon = {Textures.BallBlue, Textures.BallWhite, Textures.BallRed, Textures.BallPurple, Textures.BallSummoning, ""}, disabled = {Textures.DisBallBlue, Textures.DisBallWhite, Textures.DisBallRed, Textures.DisBallPurple, Textures.DisBallSummoning, ""}, upgrade = {Upgrades.BlueOrbs, Upgrades.WhiteOrbs, Upgrades.RedOrbs, Upgrades.PurpleOrbs, Upgrades.SummoningOrbs, Upgrades.AnyOrbs}, tooltip = {"Blue Orb", "White Orb", "Red Orb", "Purple Orb", "Summoning Orb", ""}}
end
function Orb.prototype.Destroy(self)
    PauseTimer(self.timer)
    DestroyTimer(self.timer)
end
function Orb.prototype.Update(self, player)
    local orbView = OrbView.Orbs[self.index + 1]
    if GetLocalPlayer() == player then
        orbView.mainButton:SetVisible(true)
        orbView.background:SetVisible(true)
        if self.isAvailable then
            orbView.mainImage:SetTexture(self.enabledTexture)
            orbView.cooldownCounter:SetVisible(false)
        else
            orbView.mainImage:SetTexture(self.disabledTexture)
            orbView.cooldownCounter:SetVisible(true)
            orbView.cooldownCounter:SetText(
                string.format("%.1f", self.cooldownRemaining)
            )
        end
    end
end
function Orb.prototype.Consume(self, player, seconds)
    self.isAvailable = false
    self.cooldownRemaining = seconds
    BlzDecPlayerTechResearched(player, self.upgradeId, 1)
    TimerStart(
        self.timer,
        0.1,
        true,
        function()
            self.cooldownRemaining = self.cooldownRemaining - 0.1
            if self.cooldownRemaining <= 0 or self.isAvailable == true then
                self.isAvailable = true
                AddPlayerTechResearched(player, self.upgradeId, 1)
                PauseTimer(self.timer)
            end
            self:Update(player)
        end
    )
end
function ____exports.OrbCostToString(cost)
    local retVal = "Cost ["
    local letter = {[____exports.OrbType.Red] = "|cffff3333R|r", [____exports.OrbType.White] = "W", [____exports.OrbType.Purple] = "|cffff77ffP|r", [____exports.OrbType.Blue] = "|cff0080ffB|r", [____exports.OrbType.Summoning] = "|cffffd9b3S|r", [____exports.OrbType.Any] = ""}
    local first = true
    for ____, o in ipairs(cost) do
        if letter[o] ~= "" then
            if first then
                first = false
            else
                retVal = tostring(retVal) .. " + "
            end
            retVal = tostring(retVal) .. tostring(letter[o])
        end
    end
    retVal = tostring(retVal) .. "]"
    return retVal
end
return ____exports
