require("lualib_bundle");
local ____exports = {}
____exports.Talent = {}
local Talent = ____exports.Talent
Talent.name = "Talent"
Talent.__index = Talent
Talent.prototype = {}
Talent.prototype.__index = Talent.prototype
Talent.prototype.constructor = Talent
function Talent.new(...)
    local self = setmetatable({}, Talent.prototype)
    self:____constructor(...)
    return self
end
function Talent.prototype.____constructor(self, data)
    self.name = ""
    self.description = ""
    self.icon = ""
    self.iconDisabled = ""
    self.onActivate = function() return nil end
    self.onDeactivate = function() return nil end
    self.maxRank = 1
    self.isLink = false
    if data and data.Name then
        self:Name(data.Name)
    end
    if data and data.Description then
        self:Description(data.Description)
    end
    if data and data.Icon then
        self:Icon(data.Icon)
    end
    if data and data.IconDisabled then
        self:IconDisabled(data.IconDisabled)
    end
    if data and data.OnActivate then
        self:OnActivate(data.OnActivate)
    end
    if data and data.OnDeactivate then
        self:OnDeactivate(data.OnDeactivate)
    end
    if data and data.Requirements then
        self:SetRequirements(data.Requirements)
    end
    if data and data.Dependency then
        self:Dependency(data.Dependency)
    end
end
function Talent.prototype.Name(self, newValue)
    if newValue == nil then
        return self.name
    end
    self.name = newValue
    return self
end
function Talent.prototype.Description(self, newValue)
    if not newValue then
        return self.description
    end
    self.description = newValue
    return self
end
function Talent.prototype.Icon(self, newValue)
    if newValue then
        self.icon = newValue
        self.iconDisabled = string.gsub(newValue, "CommandButtons\\", "CommandButtonsDisabled\\DIS")
    end
    return self.icon
end
function Talent.prototype.IconDisabled(self, newValue)
    if newValue == nil then
        return self.iconDisabled
    end
    self.iconDisabled = newValue
    return self
end
function Talent.prototype.OnActivate(self, callback)
    if callback == nil then
        return self.onActivate
    end
    self.onActivate = callback
    return self
end
function Talent.prototype.OnDeactivate(self, callback)
    if callback == nil then
        return self.onDeactivate
    end
    self.onDeactivate = callback
    return self
end
function Talent.prototype.Dependency(self, newValue)
    if newValue ~= nil then
        if not self.dependency then
            self.dependency = {}
        end
        if newValue.left then
            self.dependency.left = newValue.left
        end
        if newValue.up then
            self.dependency.up = newValue.up
        end
        if newValue.right then
            self.dependency.right = newValue.right
        end
        if newValue.down then
            self.dependency.down = newValue.down
        end
        return self
    end
    return self.dependency
end
function Talent.prototype.SetRequirements(self, newValue)
    self.requirements = newValue
end
function Talent.prototype.Requirements(self, tree, unit)
    if self.requirements then
        return self.requirements(tree, unit)
    end
    return {true, ""}
end
function Talent.prototype.NextRank(self, nextRank)
    if nextRank ~= nil then
        self.nextRank = nextRank
        self.nextRank.prevRank = self
        nextRank:MaxRank(self.maxRank + 1)
        return self.nextRank
    end
    return self
end
function Talent.prototype.FinalDescription(self, data)
    local t = ____exports.Talent.new()
    if data then
        if data and data.Name then
            t:Name(data.Name)
        end
        if data and data.Description then
            t:Description(data.Description)
        end
        if data and data.Icon then
            t:Icon(data.Icon)
        end
        if data and data.IconDisabled then
            t:IconDisabled(data.IconDisabled)
        end
    end
    self.nextRank = t
    t.prevRank = self
    t.maxRank = self.maxRank
    t.dependency = __TS__ObjectAssign({}, self.dependency)
    return t
end
function Talent.prototype.MaxRank(self, newValue)
    if newValue == nil then
        return self.maxRank
    end
    self.maxRank = newValue
    if self.prevRank then
        self.prevRank:MaxRank(newValue)
    end
    return self
end
function Talent.prototype.ActivateRecursive(self, unit, count)
    if self.prevRank and count > 0 then
        self.prevRank:ActivateRecursive(unit, count - 1)
    end
    self.onActivate(unit)
end
return ____exports
