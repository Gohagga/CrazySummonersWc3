require("lualib_bundle");
local ____exports = {}
____exports.FramePoint = {}
local FramePoint = ____exports.FramePoint
FramePoint.name = "FramePoint"
FramePoint.__index = FramePoint
FramePoint.prototype = {}
FramePoint.prototype.__index = FramePoint.prototype
FramePoint.prototype.constructor = FramePoint
function FramePoint.new(...)
    local self = setmetatable({}, FramePoint.prototype)
    self:____constructor(...)
    return self
end
function FramePoint.prototype.____constructor(self)
end
FramePoint.B = FRAMEPOINT_BOTTOM
FramePoint.BL = FRAMEPOINT_BOTTOMLEFT
FramePoint.L = FRAMEPOINT_LEFT
FramePoint.TL = FRAMEPOINT_TOPLEFT
FramePoint.T = FRAMEPOINT_TOP
FramePoint.TR = FRAMEPOINT_TOPRIGHT
FramePoint.R = FRAMEPOINT_RIGHT
FramePoint.BR = FRAMEPOINT_BOTTOMRIGHT
FramePoint.C = FRAMEPOINT_CENTER
____exports.Frame = {}
local Frame = ____exports.Frame
Frame.name = "Frame"
Frame.__index = Frame
Frame.prototype = {}
Frame.prototype.____getters = {}
Frame.prototype.__index = __TS__Index(Frame.prototype)
Frame.prototype.constructor = Frame
function Frame.new(...)
    local self = setmetatable({}, Frame.prototype)
    self:____constructor(...)
    return self
end
function Frame.prototype.____constructor(self, handle)
    self._frame = handle
end
function Frame.prototype.____getters.handle(self)
    return self._frame
end
function Frame.prototype.SetAbsolutePosition(self, fp, x, y)
    BlzFrameClearAllPoints(self._frame)
    BlzFrameSetAbsPoint(self._frame, fp, x, y)
    return self
end
function Frame.prototype.ClearAllPoints(self)
    BlzFrameClearAllPoints(self._frame)
    return self
end
function Frame.prototype.SetPosition(self, fp, relative, relativeFp, x, y)
    BlzFrameSetPoint(self._frame, fp, relative, relativeFp, x, y)
    return self
end
function Frame.prototype.SetSize(self, x, y)
    BlzFrameSetSize(self._frame, x, y)
    return self
end
function Frame.prototype.SetTexture(self, path)
    BlzFrameSetTexture(self._frame, path, 0, true)
    return self
end
function Frame.prototype.SetText(self, text)
    BlzFrameSetText(self._frame, text)
    return self
end
function Frame.prototype.SetScale(self, scale)
    BlzFrameSetScale(self._frame, scale)
    return self
end
function Frame.prototype.SetColor(self, rgb)
    BlzFrameSetVertexColor(self._frame, rgb)
    return self
end
function Frame.prototype.SetVisible(self, visible)
    BlzFrameSetVisible(self._frame, visible)
    return self
end
function Frame.prototype.SetEnabled(self, enabled)
    BlzFrameSetEnable(self._frame, enabled)
    return self
end
function Frame.prototype.OnClick(self, action)
    local t = CreateTrigger()
    BlzTriggerRegisterFrameEvent(t, self._frame, FRAMEEVENT_CONTROL_CLICK)
    TriggerAddAction(t, action)
    return self
end
return ____exports
