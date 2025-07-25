require("lualib_bundle");
local ____exports = {}
local ____Frame = require("UI.Frame")
local Frame = ____Frame.Frame
local FramePoint = ____Frame.FramePoint
____exports.OrbView = {}
local OrbView = ____exports.OrbView
OrbView.name = "OrbView"
OrbView.____getters = {}
OrbView.__index = OrbView
OrbView.prototype = {}
OrbView.prototype.__index = OrbView.prototype
OrbView.prototype.constructor = OrbView
setmetatable(OrbView, {__index = __TS__ClassIndex})
function OrbView.new(...)
    local self = setmetatable({}, OrbView.prototype)
    self:____constructor(...)
    return self
end
function OrbView.prototype.____constructor(self)
    self._instance = {}
end
function OrbView.____getters.Box(self)
    return self._boxFrame
end
function OrbView.____getters.Orbs(self)
    return self._orbFrames
end
function OrbView.init(self)
    self._boxFrame = Frame.new(
        BlzCreateFrameByType(
            "BACKDROP",
            "SpellstringBox",
            BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0),
            "",
            0
        )
    )
    do
        local i = 0
        while i < self.Config.MaxNodes do
            local orb = self:CreateOrb(i)
            __TS__ArrayPush(self._orbFrames, orb)
            i = i + 1
        end
    end
    do
        local ____obj, ____index = self.Config, "Y"
        ____obj[____index] = ____obj[____index] + (self.Config.Size - 0.006)
    end
    do
        local ____obj, ____index = self.Config, "X"
        ____obj[____index] = ____obj[____index] - (self.Config.Size * self.Config.MaxNodes - 0.016)
    end
    do
        local i = self.Config.MaxNodes
        while i < self.Config.MaxNodes + 6 do
            local orb = self:CreateOrb(i)
            __TS__ArrayPush(self._orbFrames, orb)
            i = i + 1
        end
    end
end
function OrbView.CreateOrb(self, i)
    local xOffset = self.Config.X + i * self.Config.Size
    local yOffset = self.Config.Y
    local bgFrame = Frame.new(
        BlzCreateFrameByType("BACKDROP", "Background", self._boxFrame.handle, "", 0)
    ):SetAbsolutePosition(FramePoint.C, xOffset, yOffset):SetSize(self.Config.BackgroundSize, self.Config.BackgroundSize):SetTexture(self.Config.NodeBackground)
    local mainButtonFrame = Frame.new(
        BlzCreateFrame("ScoreScreenBottomButtonTemplate", self._boxFrame.handle, 0, 0)
    ):SetAbsolutePosition(FramePoint.C, xOffset, yOffset):SetSize(self.Config.Size, self.Config.Size):SetVisible(false):SetEnabled(false)
    local mainImageFrame = Frame.new(
        BlzGetFrameByName("ScoreScreenButtonBackdrop", 0)
    ):SetTexture(self.Config.BoxBackground)
    local cooldownCounter = Frame.new(
        BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", mainButtonFrame.handle, "StandardInfoTextTemplate", 0)
    ):SetAbsolutePosition(FramePoint.C, xOffset, yOffset):SetScale(1.25):SetText("0.0"):SetEnabled(false):SetColor(16758842)
    local tooltipFrame = Frame.new(
        BlzCreateFrame("ListBoxWar3", mainButtonFrame.handle, 0, 0)
    ):ClearAllPoints():SetAbsolutePosition(FramePoint.BR, 0.81, 0.163):SetSize(0.3, 0.038)
    local tooltipText = Frame.new(
        BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", tooltipFrame.handle, "StandardInfoTextTemplate", 0)
    ):SetPosition(FramePoint.TL, tooltipFrame.handle, FramePoint.TL, 0.01, -0.01):SetText("sdijfwseifj wier iwerfh wierjhrtfh"):SetScale(1.25)
    BlzFrameSetTooltip(mainButtonFrame.handle, tooltipFrame.handle)
    return {mainButton = mainButtonFrame, mainImage = mainImageFrame, background = bgFrame, cooldownCounter = cooldownCounter, tooltipText = tooltipText}
end
OrbView._orbFrames = {}
OrbView.Config = {MaxNodes = 12, Size = 0.031, BackgroundSize = 0.028, X = 0.215, Y = 0.15, BoxBackground = "BlueBall.blp", NodeBackground = "BlackBall.blp"}
return ____exports
