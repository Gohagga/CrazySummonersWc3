require("lualib_bundle");
local ____exports = {}
local ____Talent = require("Global.TalentTree.Talent")
local Talent = ____Talent.Talent
local ____TalentTreeView = require("Global.TalentTree.TalentTreeView")
local TalentTreeView = ____TalentTreeView.TalentTreeView
____exports.TalentTree = {}
local TalentTree = ____exports.TalentTree
TalentTree.name = "TalentTree"
TalentTree.__index = TalentTree
TalentTree.prototype = {}
TalentTree.prototype.__index = TalentTree.prototype
TalentTree.prototype.constructor = TalentTree
function TalentTree.new(...)
    local self = setmetatable({}, TalentTree.prototype)
    self:____constructor(...)
    return self
end
function TalentTree.prototype.____constructor(self, unit, load)
    self.title = "Talent tree"
    self.pointsAvailable = 0
    self.talents = {}
    self.rankState = {}
    self.unit = unit
end
function TalentTree.prototype.CheckDependencies(self, state, index, player)
    local talent = self.talents[index + 1]
    if not talent or not talent.dependency then
        return {true, ""}
    end
    local dep = talent.dependency
    local toHide = {}
    local toShow = {}
    local ok = true
    local ____error = ""
    local link
    local depTalent
    if dep.left then
        depTalent = self.talents[index]
        link = TalentTreeView.frames.horizontalLink[index]
        __TS__ArrayPush(toShow, link)
        if depTalent and state[index] and state[index] < dep.left then
            ok = false
            ____error = tostring(____error) .. tostring(depTalent.name) .. " " .. tostring(dep.left)
            __TS__ArrayPush(toHide, link)
        end
    end
    if dep.up then
        depTalent = self.talents[(index + TalentTreeView.Columns) + 1]
        link = TalentTreeView.frames.verticalLink[index + 1]
        __TS__ArrayPush(toShow, link)
        if depTalent and state[(index + TalentTreeView.Columns) + 1] and state[(index + TalentTreeView.Columns) + 1] < dep.up then
            ok = false
            ____error = tostring(____error) .. tostring(depTalent.name) .. " " .. tostring(dep.up)
            __TS__ArrayPush(toHide, link)
        end
    end
    if dep.right then
        depTalent = self.talents[(index + 1) + 1]
        link = TalentTreeView.frames.horizontalLink[index + 1]
        __TS__ArrayPush(toShow, link)
        if depTalent and state[(index + 1) + 1] and state[(index + 1) + 1] < dep.right then
            ok = false
            ____error = tostring(____error) .. tostring(depTalent.name) .. " " .. tostring(dep.right)
            __TS__ArrayPush(toHide, link)
        end
    end
    if dep.down then
        depTalent = self.talents[(index - TalentTreeView.Columns) + 1]
        link = TalentTreeView.frames.verticalLink[(index - TalentTreeView.Columns) + 1]
        __TS__ArrayPush(toShow, link)
        if depTalent and state[(index - TalentTreeView.Columns) + 1] and state[(index - TalentTreeView.Columns) + 1] < dep.down then
            ok = false
            ____error = tostring(____error) .. tostring(depTalent.name) .. " " .. tostring(dep.down)
            __TS__ArrayPush(toHide, link)
        end
    end
    __TS__ArrayForEach(
        toShow,
        function(____, link)
            BlzFrameSetTexture(link, TalentTreeView.ActiveLinkTexture, 0, true)
            BlzFrameSetVisible(link, true)
        end
    )
    __TS__ArrayForEach(
        toHide,
        function(____, link)
            BlzFrameSetTexture(link, TalentTreeView.InactiveLinkTexture, 0, true)
        end
    )
    return {ok, ____error}
end
function TalentTree.prototype.GetTalent(self, i)
    return self.talents[i + 1]
end
function TalentTree.prototype.AddTalent(self, x, y, data)
    local position = x + y * TalentTreeView.Columns
    local talent = Talent.new(data)
    if self.talents[position + 1] then
        local existing = self.talents[position + 1]
        existing:NextRank(talent)
    else
        self.talents[position + 1] = talent
        self.rankState[position + 1] = 0
    end
    return talent
end
function TalentTree.prototype.AddMultiRankTalent(self, x, y, maxRanks, generator)
    local t = self:AddTalent(
        x,
        y,
        generator(1)
    )
    if maxRanks <= 1 then
        return
    end
    do
        local i = 2
        while i < maxRanks + 1 do
            local data = generator(i)
            t = t:NextRank(
                Talent.new(data)
            )
            i = i + 1
        end
    end
    local data = generator(maxRanks)
    t:FinalDescription(data)
end
function TalentTree.prototype.ApplyTalentTemporary(self, i)
    local talent = self.talents[i + 1]
    if not self.tempRankState then
        self.tempRankState = {}
    end
    if self.tempRankState[i + 1] < talent.maxRank then
        self.pointsAvailable = self.pointsAvailable - 1
        do
            local ____obj, ____index = self.tempRankState, i + 1
            ____obj[____index] = ____obj[____index] + 1
        end
        if talent.nextRank then
            self.talents[i + 1] = talent.nextRank
        end
    end
end
function TalentTree.prototype.GetRankState(self)
    return self.rankState
end
function TalentTree.prototype.ResetTempRankState(self)
    if not self.tempRankState then
        return
    end
    do
        local i = 0
        while i < TalentTreeView.MaxTalents do
            local talent = self.talents[i + 1]
            if talent and self.rankState[i + 1] ~= self.tempRankState[i + 1] then
                do
                    local j = self.tempRankState[i + 1]
                    while j < self.rankState[i + 1] do
                        if talent.prevRank then
                            talent = talent.prevRank
                            self.pointsAvailable = self.pointsAvailable + 1
                        end
                        j = j - 1
                    end
                end
            end
            i = i + 1
        end
    end
    self.tempRankState = nil
end
function TalentTree.prototype.SaveTalentRankState(self)
    if not self.tempRankState then
        return
    end
    do
        local i = 0
        while i < TalentTreeView.MaxTalents do
            local t = self.talents[i + 1]
            local state = self.rankState[i + 1]
            local tempState = self.tempRankState[i + 1]
            if t then
                if state and state ~= tempState then
                    t:ActivateRecursive(self.unit, tempState - state)
                    self.rankState[i + 1] = tempState
                else
                end
            end
            i = i + 1
        end
    end
    self:ResetTempRankState()
end
function TalentTree.prototype.GetTempRankState(self)
    if not self.tempRankState then
        self.tempRankState = {}
        do
            local i = 0
            while i < TalentTreeView.MaxTalents do
                self.tempRankState[i + 1] = self.rankState[i + 1]
                i = i + 1
            end
        end
    end
    return self.tempRankState
end
function TalentTree.prototype.Serialize(self)
end
function TalentTree.prototype.loadFromSerializedData(self, data)
end
TalentTree.Id = 0
return ____exports
