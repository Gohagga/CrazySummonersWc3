local ____exports = {}
local ____GamePlayer = require("Systems.GamePlayer")
local GamePlayer = ____GamePlayer.GamePlayer
____exports.Cameras = {}
local Cameras = ____exports.Cameras
Cameras.name = "Cameras"
Cameras.__index = Cameras
Cameras.prototype = {}
Cameras.prototype.__index = Cameras.prototype
Cameras.prototype.constructor = Cameras
function Cameras.new(...)
    local self = setmetatable({}, Cameras.prototype)
    self:____constructor(...)
    return self
end
function Cameras.prototype.____constructor(self)
end
function Cameras.SetPlayerTeamCamera(self, player)
    local team = GamePlayer.Team[GetPlayerId(player)]
    local camera = self.Setup[self.TeamCameras[team]]
    CameraSetupApplyForPlayer(true, camera, player, 0)
end
function Cameras.init(self)
    self.Setup = {h1 = gg_cam_GameCameraH1, h2 = gg_cam_GameCameraH2, red = gg_cam_GameCamera_Red, blue = gg_cam_GameCamera_Blue}
    local t = CreateTrigger()
    do
        local i = 0
        while i < 8 do
            TriggerRegisterPlayerChatEvent(
                t,
                Player(i),
                "-cam",
                true
            )
            i = i + 1
        end
    end
    TriggerAddAction(
        t,
        function()
            local player = GetTriggerPlayer()
            ____exports.Cameras:SetPlayerTeamCamera(player)
        end
    )
end
Cameras.TeamCameras = {[1] = "h1", [2] = "h1"}
return ____exports
