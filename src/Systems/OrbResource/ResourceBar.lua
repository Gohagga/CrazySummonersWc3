require("lualib_bundle");
local ____exports = {}
local ____Orb = require("Systems.OrbResource.Orb")
local Orb = ____Orb.Orb
local OrbType = ____Orb.OrbType
local ____OrbView = require("Systems.OrbResource.OrbView")
local OrbView = ____OrbView.OrbView
____exports.ResourceBar = {}
local ResourceBar = ____exports.ResourceBar
ResourceBar.name = "ResourceBar"
ResourceBar.__index = ResourceBar
ResourceBar.prototype = {}
ResourceBar.prototype.____getters = {}
ResourceBar.prototype.__index = __TS__Index(ResourceBar.prototype)
ResourceBar.prototype.constructor = ResourceBar
function ResourceBar.new(...)
    local self = setmetatable({}, ResourceBar.prototype)
    self:____constructor(...)
    return self
end
function ResourceBar.prototype.____constructor(self, player)
    self.orbs = {}
    self.topRowCount = 0
    self.bypass = false
    self.player = player
end
function ResourceBar.prototype.____getters.Orbs(self)
    return self.orbs
end
function ResourceBar.prototype.____getters.GetPlayer(self)
    return self.player
end
function ResourceBar.Register(self, rb)
    local playerId = GetPlayerId(rb.player)
    ____exports.ResourceBar._instance[playerId] = rb
    if GetLocalPlayer() == rb.player then
        OrbView.Box:SetVisible(true)
    end
end
function ResourceBar.ResetUpgrades(self, player)
    local rb = self._instance[GetPlayerId(player)]
    if not rb then
        return
    end
    for ____, u in ipairs(Orb.Config.upgrade) do
        BlzDecPlayerTechResearched(
            player,
            u,
            GetPlayerTechCountSimple(u, player)
        )
    end
    if player == GetLocalPlayer() then
        for ____, ov in ipairs(OrbView.Orbs) do
            ov.mainButton:SetVisible(false)
        end
    end
    for ____, o in ipairs(rb.orbs) do
        o:Destroy()
    end
    rb.orbs = {}
end
function ResourceBar.prototype.AddOrb(self, ____type)
    local viewId = #self.orbs
    if viewId > 17 then
        return
    end
    if ____type == OrbType.Summoning then
        viewId = 12 + self.topRowCount
        if viewId > 17 then
            return
        end
        self.topRowCount = self.topRowCount + 1
    else
        viewId = #self.orbs - self.topRowCount
        if viewId > 11 then
            return
        end
    end
    local orb = Orb.new(____type, viewId)
    local index = __TS__ArrayPush(self.orbs, orb)
    orb:Update(self.player)
    AddPlayerTechResearched(self.player, orb.upgradeId, 1)
end
function ResourceBar.Get(self, player)
    return self._instance[GetPlayerId(player)]
end
function ResourceBar.prototype.ForceCast(self, costlessActions)
    self.bypass = true
    costlessActions()
    self.bypass = false
end
function ResourceBar.prototype.Consume(self, cost)
    if cost == nil then
        cost = {}
    end
    if self.bypass then
        return true
    end
    local usedTypes = {}
    do
        local i = 0
        while i < #self.orbs do
            usedTypes[i + 1] = {type = self.orbs[i + 1].type, available = self.orbs[i + 1].isAvailable}
            i = i + 1
        end
    end
    local usedIndices = {}
    do
        local i = 0
        while i < #cost do
            local hasMat = false
            do
                local j = 0
                while j < #usedTypes do
                    local consume = false
                    if usedTypes[j + 1].available and cost[i + 1] == usedTypes[j + 1].type then
                        usedTypes[j + 1].available = false
                        hasMat = true
                        __TS__ArrayPush(usedIndices, j)
                        break
                    end
                    j = j + 1
                end
            end
            if hasMat == false then
                return false
            end
            i = i + 1
        end
    end
    for ____, index in ipairs(usedIndices) do
        self.orbs[index + 1]:Consume(self.player, 20)
    end
    return true
end
function ResourceBar.init(self)
end
ResourceBar._instance = {}
return ____exports
