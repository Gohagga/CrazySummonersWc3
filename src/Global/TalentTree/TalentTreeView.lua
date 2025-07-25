require("lualib_bundle");
local ____exports = {}
local ConfigFrames
function ConfigFrames(config, frames)
    for k in pairs(config) do
        local v = config[k]
        if v.clear then
            BlzFrameClearAllPoints(frames[k])
        end
        if v.size then
            BlzFrameSetSize(frames[k], v.size.x, v.size.y)
        end
        if v.pos and v.abs then
            BlzFrameSetAbsPoint(frames[k], v.pos.pointSelf, v.pos.p.x, v.pos.p.y)
        elseif v.pos and v.point and v.pos.frameOther and v.pos.pointOther then
            BlzFrameSetPoint(frames[k], v.pos.pointSelf, v.pos.frameOther, v.pos.pointOther, v.pos.p.x, v.pos.p.y)
        end
        if v.text then
            BlzFrameSetText(frames[k], v.text)
        end
        if v.texture then
            BlzFrameSetTexture(frames[k], v.texture, 0, true)
        end
    end
end
____exports.TalentTreeView = {}
local TalentTreeView = ____exports.TalentTreeView
TalentTreeView.name = "TalentTreeView"
TalentTreeView.__index = TalentTreeView
TalentTreeView.prototype = {}
TalentTreeView.prototype.__index = TalentTreeView.prototype
TalentTreeView.prototype.constructor = TalentTreeView
function TalentTreeView.new(...)
    local self = setmetatable({}, TalentTreeView.prototype)
    self:____constructor(...)
    return self
end
function TalentTreeView.prototype.____constructor(self)
end
function TalentTreeView.RenderForPlayer(self, player)
    local playerId = GetPlayerId(player)
    if self.playerViewedTree[playerId + 1] == nil then
        return
    end
    local tt = self.playerViewedTree[playerId + 1]
    local tempState = tt:GetTempRankState()
    if GetLocalPlayer() == player then
        do
            local i = 0
            while i < self.MaxTalents do
                BlzFrameSetVisible(self.frames.horizontalLink[i + 1], false)
                BlzFrameSetVisible(self.frames.verticalLink[i + 1], false)
                i = i + 1
            end
        end
    end
    do
        local i = 0
        while i < self.MaxTalents do
            local frame = self.frames.talents[i + 1]
            local talent = tt:GetTalent(i)
            if talent then
                local dep, depString = table.unpack(
                    tt:CheckDependencies(tempState, i, player)
                )
                local req, reqString = table.unpack(
                    talent:Requirements(tt, tt.unit)
                )
                local requirements = "\n|cffff6450Requires: " .. tostring(depString)
                if not req then
                    requirements = tostring(requirements) .. ", " .. tostring(reqString)
                end
                requirements = tostring(requirements) .. "|r\n\n"
                if GetLocalPlayer() == player then
                    BlzFrameSetText(
                        frame.tooltipRank,
                        "Rank " .. tostring(tempState[i + 1]) .. "/" .. tostring(talent.maxRank)
                    )
                    if dep and req then
                        local description = talent.description
                        if talent.nextRank and talent.prevRank then
                            description = tostring(talent.prevRank.description) .. "\n\nNext rank:\n" .. tostring(description)
                        end
                        BlzFrameSetText(
                            frame.tooltipText,
                            tostring(
                                talent:Name()
                            ) .. "\n\n" .. tostring(description)
                        )
                        if tt.pointsAvailable > 0 then
                            BlzFrameSetEnable(frame.button, true)
                            BlzFrameSetVisible(frame.availableImage, true)
                        else
                            BlzFrameSetEnable(frame.button, false)
                            BlzFrameSetEnable(frame.availableImage, false)
                        end
                    else
                        BlzFrameSetEnable(frame.button, false)
                        BlzFrameSetText(
                            frame.tooltipText,
                            tostring(
                                talent:Name()
                            ) .. "\n" .. tostring(requirements) .. tostring(talent.description)
                        )
                        BlzFrameSetVisible(frame.availableImage, false)
                    end
                    if tempState[i + 1] == talent.maxRank then
                        BlzFrameSetTexture(frame.icon, talent.icon, 0, true)
                        BlzFrameSetEnable(frame.button, false)
                        BlzFrameSetVisible(frame.availableImage, false)
                        BlzFrameSetText(
                            frame.tooltipText,
                            tostring(talent.name) .. "\n\n" .. tostring(talent.description)
                        )
                    elseif tempState[i + 1] > 0 then
                        BlzFrameSetTexture(frame.icon, talent.icon, 0, true)
                    else
                        BlzFrameSetTexture(frame.icon, talent.iconDisabled, 0, true)
                    end
                    if talent.maxRank > 1 then
                        BlzFrameSetText(
                            frame.rankText,
                            "" .. tostring(tempState[i + 1])
                        )
                        BlzFrameSetVisible(frame.rankText, true)
                        BlzFrameSetVisible(frame.rankImage, true)
                    else
                        BlzFrameSetVisible(frame.rankText, false)
                        BlzFrameSetVisible(frame.rankImage, false)
                    end
                    if not talent.isLink then
                        BlzFrameSetVisible(frame.button, true)
                    else
                        BlzFrameSetVisible(frame.button, false)
                    end
                end
            elseif GetLocalPlayer() == player then
                BlzFrameSetVisible(frame.button, false)
                BlzFrameSetVisible(frame.availableImage, false)
            end
            i = i + 1
        end
    end
    local titleText = tostring(tt.title) .. " (" .. tostring(tt.pointsAvailable) .. ") points"
    if GetLocalPlayer() == player then
        BlzFrameSetText(self.frames.title, titleText)
        BlzFrameSetVisible(self.frames.box, true)
    end
end
function TalentTreeView.OnConfirm(self)
    local player = GetTriggerPlayer()
    local playerId = GetPlayerId(player)
    if self.playerViewedTree[playerId + 1] == nil then
        return
    end
    local tt = self.playerViewedTree[playerId + 1]
    tt:SaveTalentRankState()
    if GetLocalPlayer() == player then
        BlzFrameSetVisible(self.frames.box, false)
    end
end
function TalentTreeView.OnCancel(self)
    local player = GetTriggerPlayer()
    local playerId = GetPlayerId(player)
    if self.playerViewedTree[playerId + 1] == nil then
        return
    end
    local tt = self.playerViewedTree[playerId + 1]
    local tempState = tt:GetTempRankState()
    tt:ResetTempRankState()
    if GetLocalPlayer() == player then
        BlzFrameSetVisible(self.frames.box, false)
        BlzFrameSetEnable(self.frames.cancelButton, false)
        BlzFrameSetEnable(self.frames.cancelButton, true)
    end
end
function TalentTreeView.OnClicked(self, i, player)
    local playerId = GetPlayerId(player)
    if self.playerViewedTree[playerId + 1] == nil then
        return
    end
    local tt = self.playerViewedTree[playerId + 1]
    local tempState = tt:GetTempRankState()
    local talent = tt:GetTalent(i)
    if tt.pointsAvailable > 0 and tempState[i + 1] < talent.maxRank then
        tt:ApplyTalentTemporary(i)
        self:RenderForPlayer(player)
    end
end
function TalentTreeView.InitTalentFrame(self, index)
    local config = {}
    local tf = {}
    if math.fmod(index, self.Columns) < 3 then
        tf.horizontalLink = BlzCreateFrameByType("BACKDROP", "HorizontalLink", self.frames.box, "", 0)
        self.frames.horizontalLink[index + 1] = tf.horizontalLink
    end
    if index < (self.MaxTalents - self.Columns) then
        tf.verticalLink = BlzCreateFrameByType("BACKDROP", "VerticalLink", self.frames.box, "", 0)
        self.frames.verticalLink[index + 1] = tf.verticalLink
    end
    tf.availableImage = BlzCreateFrameByType("BACKDROP", "AvailableImg", self.frames.box, "", 0)
    tf.mainButton = BlzCreateFrame("ScoreScreenBottomButtonTemplate", self.frames.box, 0, 0)
    tf.mainImage = BlzGetFrameByName("ScoreScreenButtonBackdrop", 0)
    tf.tooltipBox = BlzCreateFrame("ListBoxWar3", tf.mainButton, 0, 0)
    tf.tooltipText = BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", tf.tooltipBox, "StandardInfoTextTemplate", 0)
    tf.rankImage = BlzCreateFrameByType("BACKDROP", "Counter", tf.mainButton, "", 0)
    tf.rankText = BlzCreateFrameByType("TEXT", "FaceFrameTooltip", tf.mainButton, "", 0)
    tf.tooltipRank = BlzCreateFrameByType("TEXT", "FaceFrameTooltip", tf.tooltipBox, "", 0)
    BlzFrameSetTooltip(tf.mainButton, tf.tooltipBox)
    BlzFrameSetTextAlignment(tf.rankText, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE)
    BlzFrameSetTextAlignment(tf.tooltipRank, TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_RIGHT)
    local xPos = math.floor(
        math.fmod(index, self.Columns)
    )
    local yPos = math.floor(index / self.Columns)
    local xIncrem = (self.Width * (1 - self.SideMargin)) / (self.Columns + 1)
    local yIncrem = (self.Height * (1 - self.VerticalMargin)) / (self.Rows + 1)
    local xOffset = xPos * xIncrem - ((self.Columns - 1) * 0.5) * xIncrem
    local yOffset = yPos * yIncrem - ((self.Rows - 1) * 0.5) * yIncrem
    config.mainButton = {point = true, pos = {pointSelf = FRAMEPOINT_CENTER, frameOther = self.frames.box, pointOther = FRAMEPOINT_CENTER, p = {x = xOffset, y = yOffset}}, size = {x = self.TalentWidth, y = self.TalentHeight}}
    config.tooltipBox = {point = true, pos = {pointSelf = FRAMEPOINT_TOPLEFT, frameOther = self.frames.box, pointOther = FRAMEPOINT_TOPRIGHT, p = {x = 0, y = 0}}, size = {x = self.TooltipBoxWidth, y = self.TooltipBoxHeight}}
    config.tooltipText = {clear = true, point = true, pos = {pointSelf = FRAMEPOINT_CENTER, frameOther = tf.tooltipBox, pointOther = FRAMEPOINT_CENTER, p = {x = 0, y = 0}}, size = {x = self.TooltipBoxWidth - 0.03, y = self.TooltipBoxHeight - 0.03}, text = "Default talent name \n\nDefault talent description"}
    config.rankImage = {point = true, pos = {pointSelf = FRAMEPOINT_BOTTOMRIGHT, frameOther = tf.mainButton, pointOther = FRAMEPOINT_BOTTOMRIGHT, p = {x = -0.0006, y = 0.0015}}, size = {x = 0.014, y = 0.014}, texture = self.RankIconTexture}
    config.rankText = {clear = true, point = true, pos = {pointSelf = FRAMEPOINT_CENTER, frameOther = tf.rankImage, pointOther = FRAMEPOINT_CENTER, p = {x = 0, y = 0}}, size = {x = 0.01, y = 0.012}, text = "0"}
    config.verticalLink = {point = true, pos = {pointSelf = FRAMEPOINT_BOTTOM, frameOther = self.frames.box, pointOther = FRAMEPOINT_CENTER, p = {x = xOffset, y = yOffset}}, size = {x = self.TalentWidth * 0.1, y = yIncrem}, texture = self.InactiveLinkTexture}
    config.horizontalLink = {point = true, pos = {pointSelf = FRAMEPOINT_LEFT, frameOther = self.frames.box, pointOther = FRAMEPOINT_CENTER, p = {x = xOffset, y = yOffset}}, size = {x = xIncrem, y = self.TalentHeight * 0.1}, texture = self.InactiveLinkTexture}
    config.availableImage = {point = true, pos = {pointSelf = FRAMEPOINT_CENTER, frameOther = tf.mainButton, pointOther = FRAMEPOINT_CENTER, p = {x = 0, y = 0}}, size = {x = self.TalentWidth * self.OutlineBorderRatio, y = self.TalentHeight * self.OutlineBorderRatio}, texture = self.AvailableTalentBackgroundTexture}
    config.mainImage = {texture = self.DefaultTalentIconTexture}
    config.tooltipRank = {clear = true, point = true, pos = {pointSelf = FRAMEPOINT_TOP, frameOther = tf.tooltipBox, pointOther = FRAMEPOINT_TOP, p = {x = 0, y = -0.015}}, size = {x = self.TooltipBoxWidth - 0.03, y = self.TooltipBoxHeight - 0.03}, text = "Rank 1/3"}
    ConfigFrames(config, tf)
    local talentFrame = {
        availableImage = tf.availableImage,
        button = tf.mainButton,
        icon = tf.mainImage,
        tooltipBox = tf.tooltipBox,
        tooltipText = tf.tooltipText,
        rankImage = tf.rankImage,
        rankText = tf.rankText,
        tooltipRank = tf.tooltipRank,
        onClickTrigger = CreateTrigger(),
        onClick = function()
            local frame = BlzGetTriggerFrame()
            BlzFrameSetEnable(frame, false)
            BlzFrameSetEnable(frame, true)
            self:OnClicked(
                index,
                GetTriggerPlayer()
            )
        end
    }
    BlzTriggerRegisterFrameEvent(talentFrame.onClickTrigger, talentFrame.button, FRAMEEVENT_CONTROL_CLICK)
    TriggerAddAction(
        talentFrame.onClickTrigger,
        function() return talentFrame.onClick() end
    )
    return talentFrame
end
function TalentTreeView.init(self)
    local t = CreateTrigger()
    TriggerRegisterTimerEventSingle(t, 0.1)
    TriggerAddAction(
        t,
        function()
            local config = {}
            local frames = {}
            self.MaxTalents = self.Columns * self.Rows
            frames.box = BlzCreateFrame(
                "SuspendDialog",
                BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0),
                0,
                0
            )
            config.box = {clear = true, abs = true, pos = {p = {x = 0.35, y = 0.34}, pointSelf = FRAMEPOINT_CENTER}, size = {x = self.Width, y = self.Height}}
            frames.title = BlzGetFrameByName("SuspendTitleText", 0)
            config.title = {text = "Talent Tree"}
            frames.confirmButton = BlzGetFrameByName("SuspendDropPlayersButton", 0)
            config.confirmButton = {clear = true, point = true, pos = {p = {x = 0, y = 0.02}, frameOther = frames.box, pointSelf = FRAMEPOINT_BOTTOMRIGHT, pointOther = FRAMEPOINT_BOTTOM}, size = {x = 0.12, y = 0.03}}
            frames.confirmText = BlzGetFrameByName("SuspendDropPlayersButtonText", 0)
            config.confirmText = {text = "Confirm"}
            frames.cancelButton = BlzCreateFrame("ScriptDialogButton", frames.box, 0, 0)
            config.cancelButton = {clear = true, point = true, pos = {p = {x = 0, y = 0.02}, frameOther = frames.box, pointSelf = FRAMEPOINT_BOTTOMLEFT, pointOther = FRAMEPOINT_BOTTOM}, size = {x = 0.12, y = 0.03}}
            frames.cancelText = BlzGetFrameByName("ScriptDialogButtonText", 0)
            config.cancelText = {text = "Cancel"}
            self.frames = {box = frames.box, title = frames.title, confirmButton = frames.confirmButton, confirmText = frames.confirmText, cancelButton = frames.cancelButton, cancelText = frames.cancelText, talents = {}, horizontalLink = {}, verticalLink = {}}
            ConfigFrames(config, frames)
            do
                local i = 0
                while i < self.MaxTalents do
                    __TS__ArrayPush(
                        self.frames.talents,
                        self:InitTalentFrame(i)
                    )
                    i = i + 1
                end
            end
            self.confirmTrigger = CreateTrigger()
            self.cancelTrigger = CreateTrigger()
            BlzTriggerRegisterFrameEvent(self.confirmTrigger, frames.confirmButton, FRAMEEVENT_CONTROL_CLICK)
            BlzTriggerRegisterFrameEvent(self.cancelTrigger, frames.cancelButton, FRAMEEVENT_CONTROL_CLICK)
            TriggerAddAction(
                self.confirmTrigger,
                function() return self:OnConfirm() end
            )
            TriggerAddAction(
                self.cancelTrigger,
                function() return self:OnCancel() end
            )
            BlzFrameSetVisible(self.frames.box, false)
        end
    )
    local t2 = CreateTrigger()
    TriggerRegisterPlayerChatEvent(
        t2,
        Player(0),
        "-tt",
        true
    )
    TriggerAddAction(
        t2,
        function() return self:RenderForPlayer(
            Player(0)
        ) end
    )
end
function TalentTreeView.SetPlayerViewedTree(self, player, talentTree)
    self.playerViewedTree[GetPlayerId(player) + 1] = talentTree
end
TalentTreeView.Columns = 4
TalentTreeView.Rows = 7
TalentTreeView.Width = 0.3
TalentTreeView.Height = 0.44
TalentTreeView.SideMargin = 0.1
TalentTreeView.VerticalMargin = 0.15
TalentTreeView.TalentWidth = 0.04
TalentTreeView.TalentHeight = 0.04
TalentTreeView.OutlineBorderRatio = 0.95
TalentTreeView.TooltipBoxWidth = 0.28
TalentTreeView.TooltipBoxHeight = 0.16
TalentTreeView.DefaultTalentIconTexture = "ReplaceableTextures/CommandButtons/BTNPeasant.blp"
TalentTreeView.RankIconTexture = "UI/Widgets/Console/Human/human-transport-slot.blp"
TalentTreeView.InactiveLinkTexture = "UI/Widgets/Console/Human/human-inventory-slotfiller.blp"
TalentTreeView.ActiveLinkTexture = "Textures/Water00.blp"
TalentTreeView.AvailableTalentBackgroundTexture = "UI/Widgets/Console/Human/CommandButton/human-activebutton.blp"
TalentTreeView.playerViewedTree = {}
return ____exports
