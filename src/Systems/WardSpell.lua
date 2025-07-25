local ____exports = {}
____exports.WardSpell = {}
local WardSpell = ____exports.WardSpell
WardSpell.name = "WardSpell"
WardSpell.__index = WardSpell
WardSpell.prototype = {}
WardSpell.prototype.__index = WardSpell.prototype
WardSpell.prototype.constructor = WardSpell
function WardSpell.new(...)
    local self = setmetatable({}, WardSpell.prototype)
    self:____constructor(...)
    return self
end
function WardSpell.prototype.____constructor(self)
    self.onDestroy = function()
    end
end
function WardSpell.RegisterWardTarget(self, unit, spawnPoint)
    local wardTarget = ____exports.WardSpell.new()
    self._instance[GetHandleId(unit)] = wardTarget
end
function WardSpell.FromTarget(self, target)
    local targetId = GetHandleId(target)
    if ____exports.WardSpell._instance[targetId] ~= nil then
        return ____exports.WardSpell._instance[targetId]
    end
    return nil
end
function WardSpell.ApplyWard(self, target, wardSpell)
    local targetId = GetHandleId(target)
    if ____exports.WardSpell._instance[targetId] ~= nil then
        local previous = ____exports.WardSpell._instance[targetId]
        previous:onDestroy()
        ____exports.WardSpell._instance[targetId] = wardSpell
        return true
    end
    return false
end
WardSpell._instance = {}
return ____exports
