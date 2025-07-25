local ____exports = {}
local ____GamePlayer = require("Systems.GamePlayer")
local GamePlayer = ____GamePlayer.GamePlayer
____exports.GameRound = {}
local GameRound = ____exports.GameRound
GameRound.name = "GameRound"
GameRound.__index = GameRound
GameRound.prototype = {}
GameRound.prototype.__index = GameRound.prototype
GameRound.prototype.constructor = GameRound
function GameRound.new(...)
    local self = setmetatable({}, GameRound.prototype)
    self:____constructor(...)
    return self
end
function GameRound.prototype.____constructor(self)
end
function GameRound.Start(self)
    if self.IsRunning == false then
        print("Game has started!")
        EnableTrigger(self.UpdateTrigger)
        self.IsRunning = true
    end
end
function GameRound.End(self)
    if self.IsRunning then
        print("Game has ended!")
        DisableTrigger(self.UpdateTrigger)
        self.IsRunning = false
        self.ExpGain = 20
    end
end
function GameRound.init(self)
    local t = CreateTrigger()
    TriggerRegisterPlayerChatEvent(
        t,
        Player(0),
        "-start",
        true
    )
    TriggerAddAction(
        t,
        function() return self:Start() end
    )
    t = CreateTrigger()
    TriggerRegisterPlayerChatEvent(
        t,
        Player(0),
        "-end",
        true
    )
    TriggerAddAction(
        t,
        function() return self:End() end
    )
    TriggerRegisterTimerEventPeriodic(self.UpdateTrigger, 2.5)
    TriggerAddAction(
        self.UpdateTrigger,
        function()
            local exp = math.floor(self.ExpGain + 0.5)
            do
                local i = 0
                while i < 8 do
                    if GamePlayer.Hero[i] then
                        AddHeroXP(GamePlayer.Hero[i], exp, true)
                    end
                    i = i + 1
                end
            end
            self.ExpGain = self.ExpGain * 1.01
        end
    )
    DisableTrigger(self.UpdateTrigger)
end
GameRound.Timer = CreateTimer()
GameRound.ExpGain = 20
GameRound.IsRunning = false
GameRound.UpdateTrigger = CreateTrigger()
return ____exports
