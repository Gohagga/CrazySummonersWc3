local ____exports = {}
____exports.ProgressBar = {}
local ProgressBar = ____exports.ProgressBar
ProgressBar.name = "ProgressBar"
ProgressBar.__index = ProgressBar
ProgressBar.prototype = {}
ProgressBar.prototype.__index = ProgressBar.prototype
ProgressBar.prototype.constructor = ProgressBar
function ProgressBar.new(...)
    local self = setmetatable({}, ProgressBar.prototype)
    self:____constructor(...)
    return self
end
function ProgressBar.prototype.____constructor(self, unit)
    self.done = true
    self.curValue = 0
    self.endValue = 0
    self.speed = 0
    self.reverse = false
    self.timer = CreateTimer()
    self.timer2 = CreateTimer()
    self.onDone = function() return nil end
    self.z = 250
    self.unit = unit
    self.sfx = AddSpecialEffect(
        ____exports.ProgressBar.Model,
        GetUnitX(unit),
        GetUnitY(unit)
    )
    BlzSetSpecialEffectScale(self.sfx, ____exports.ProgressBar.Size)
    BlzSetSpecialEffectTime(self.sfx, 1)
    BlzSetSpecialEffectTimeScale(self.sfx, 0)
    TimerStart(
        self.timer,
        ____exports.ProgressBar.UpdatePeriod,
        true,
        function() return self:UpdatePosition() end
    )
end
function ProgressBar.prototype.UpdatePosition(self)
    BlzSetSpecialEffectPosition(
        self.sfx,
        GetUnitX(self.unit),
        GetUnitY(self.unit),
        self.z
    )
end
function ProgressBar.prototype.SetPercentage(self, percent, speed, onDone)
    self.endValue = percent
    self.speed = speed
    self.reverse = self.curValue > self.endValue
    if speed and self.done then
        TimerStart(
            self.timer2,
            0.01,
            true,
            function() return self:UpdatePercentage() end
        )
    else
        BlzSetSpecialEffectTime(self.sfx, percent)
    end
end
function ProgressBar.prototype.UpdatePercentage(self)
    local tim = GetExpiredTimer()
    if self.reverse then
        if self.curValue * 0.98 > self.endValue then
            BlzSetSpecialEffectTimeScale(self.sfx, -self.speed)
            self.curValue = (self.curValue - self.speed)
        elseif self.curValue * 0.98 < self.endValue then
            PauseTimer(tim)
            BlzSetSpecialEffectTimeScale(self.sfx, 0)
            self.curValue = self.endValue
            self.done = true
            self:onDone()
        end
    else
        if self.curValue < self.endValue * 0.98 then
            BlzSetSpecialEffectTimeScale(self.sfx, self.speed)
            self.curValue = (self.curValue + self.speed)
        elseif self.curValue >= self.endValue * 0.98 then
            PauseTimer(tim)
            BlzSetSpecialEffectTimeScale(self.sfx, 0)
            self.curValue = self.endValue
            self.done = true
            self:onDone()
        end
    end
end
function ProgressBar.prototype.Finish(self)
    BlzSetSpecialEffectTimeScale(self.sfx, 3)
    DestroyEffect(self.sfx)
    PauseTimer(self.timer2)
    DestroyTimer(self.timer2)
end
function ProgressBar.prototype.Destroy(self)
    BlzSetSpecialEffectAlpha(self.sfx, 0)
    DestroyEffect(self.sfx)
    PauseTimer(self.timer2)
    DestroyTimer(self.timer2)
end
ProgressBar.Model = "Progressbar_01.mdl"
ProgressBar.UpdatePeriod = 0.03
ProgressBar.Size = 2.5
____exports.CastBar = {}
local CastBar = ____exports.CastBar
CastBar.name = "CastBar"
CastBar.__index = CastBar
CastBar.prototype = {}
CastBar.prototype.__index = CastBar.prototype
CastBar.prototype.constructor = CastBar
CastBar.____super = ____exports.ProgressBar
setmetatable(CastBar, CastBar.____super)
setmetatable(CastBar.prototype, CastBar.____super.prototype)
function CastBar.new(...)
    local self = setmetatable({}, CastBar.prototype)
    self:____constructor(...)
    return self
end
function CastBar.prototype.____constructor(self, unit)
    CastBar.____super.prototype.____constructor(self, unit)
    self.spellId = 0
end
function CastBar.prototype.CastSpell(self, spellId, castTime, callback)
    self.endValue = 100
    self.speed = (1 / castTime)
    self.onDone = function() return callback() end
    BlzSetSpecialEffectTime(self.sfx, 0)
    if self.done then
        TimerStart(
            self.timer2,
            0.01,
            true,
            function() return self:UpdatePercentage() end
        )
        if spellId then
            ____exports.CastBar.instance[GetHandleId(self.unit)] = spellId
        end
        if castTime < 0.15 then
            DestroyEffect(self.sfx)
        end
    end
end
function CastBar.GetUnitCurrentSpellId(self, unit)
    local unitId = GetHandleId(unit)
    if ____exports.CastBar.instance[unitId] ~= nil then
        return ____exports.CastBar.instance[unitId]
    end
    return -1
end
function CastBar.prototype.Finish(self)
    BlzSetSpecialEffectTimeScale(self.sfx, 3)
    DestroyEffect(self.sfx)
    PauseTimer(self.timer2)
    DestroyTimer(self.timer2)
    if ____exports.CastBar.instance[GetHandleId(self.unit)] ~= nil then
        ____exports.CastBar.instance[GetHandleId(self.unit)] = nil
    end
end
function CastBar.prototype.Destroy(self)
    BlzSetSpecialEffectAlpha(self.sfx, 0)
    DestroyEffect(self.sfx)
    PauseTimer(self.timer2)
    DestroyTimer(self.timer2)
    if ____exports.CastBar.instance[GetHandleId(self.unit)] ~= nil then
        ____exports.CastBar.instance[GetHandleId(self.unit)] = nil
    end
end
CastBar.instance = {}
return ____exports
