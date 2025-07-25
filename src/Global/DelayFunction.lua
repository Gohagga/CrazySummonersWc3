local ____exports = {}
____exports.DelayFunction = {}
local DelayFunction = ____exports.DelayFunction
DelayFunction.name = "DelayFunction"
DelayFunction.__index = DelayFunction
DelayFunction.prototype = {}
DelayFunction.prototype.__index = DelayFunction.prototype
DelayFunction.prototype.constructor = DelayFunction
function DelayFunction.new(...)
    local self = setmetatable({}, DelayFunction.prototype)
    self:____constructor(...)
    return self
end
function DelayFunction.prototype.____constructor(self, delay, func)
    self.func = function() return func() end
    self.delay = delay
end
function DelayFunction.prototype.Run(self)
    local tim = CreateTimer()
    TimerStart(
        tim,
        self.delay,
        false,
        function()
            PauseTimer(tim)
            DestroyTimer(tim)
            self:func()
            if self.next then
                self.next:Run()
            end
        end
    )
    return self
end
function DelayFunction.prototype.Then(self, delay, func)
    self.next = ____exports.DelayFunction.new(delay, func)
    return self.next
end
function DelayFunction.SmoothRun(self, delay, func)
    return ____exports.DelayFunction.new(delay, func):Run()
end
return ____exports
