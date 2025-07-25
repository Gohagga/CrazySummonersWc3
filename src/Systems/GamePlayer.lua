local ____exports = {}
____exports.GamePlayer = {}
local GamePlayer = ____exports.GamePlayer
GamePlayer.name = "GamePlayer"
GamePlayer.__index = GamePlayer
GamePlayer.prototype = {}
GamePlayer.prototype.__index = GamePlayer.prototype
GamePlayer.prototype.constructor = GamePlayer
function GamePlayer.new(...)
    local self = setmetatable({}, GamePlayer.prototype)
    self:____constructor(...)
    return self
end
function GamePlayer.prototype.____constructor(self)
end
function GamePlayer.init(self)
end
GamePlayer.SpawnPoint = {}
GamePlayer.Hero = {}
GamePlayer.HeroSelect = {}
GamePlayer.Team = {[0] = 1, [2] = 1, [3] = 1, [5] = 1, [1] = 2, [4] = 2, [6] = 2, [9] = 2}
return ____exports
