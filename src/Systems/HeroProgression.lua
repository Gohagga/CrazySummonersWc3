local ____exports = {}
____exports.HeroProgression = {}
local HeroProgression = ____exports.HeroProgression
HeroProgression.name = "HeroProgression"
HeroProgression.__index = HeroProgression
HeroProgression.prototype = {}
HeroProgression.prototype.__index = HeroProgression.prototype
HeroProgression.prototype.constructor = HeroProgression
function HeroProgression.new(...)
    local self = setmetatable({}, HeroProgression.prototype)
    self:____constructor(...)
    return self
end
function HeroProgression.prototype.____constructor(self, unit)
    self.unit = unit
end
function HeroProgression.Register(self, instance)
    local unitId = GetHandleId(instance.unit)
    local c = coroutine.create(
        function(unit) return instance:ProgressFunction(unit) end
    )
    coroutine.resume(c, instance.unit)
    ____exports.HeroProgression._instance[unitId] = c
end
function HeroProgression.WaitForUnitLevel(self, unit, level)
    while GetUnitLevel(unit) < level do
        coroutine.yield()
    end
end
function HeroProgression.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_LEVEL)
    TriggerAddAction(
        t,
        function()
            local unit = GetTriggerUnit()
            local unitId = GetHandleId(unit)
            if ____exports.HeroProgression._instance[unitId] then
                coroutine.resume(____exports.HeroProgression._instance[unitId], unit)
            end
        end
    )
end
HeroProgression._instance = {}
return ____exports
