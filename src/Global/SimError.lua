local ____exports = {}
____exports.SimError = {}
local SimError = ____exports.SimError
SimError.name = "SimError"
SimError.__index = SimError
SimError.prototype = {}
SimError.prototype.__index = SimError.prototype
SimError.prototype.constructor = SimError
function SimError.new(...)
    local self = setmetatable({}, SimError.prototype)
    self:____constructor(...)
    return self
end
function SimError.prototype.____constructor(self)
end
function SimError.Msg(self, forPlayer, msg)
    msg = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n|cffffcc00" .. tostring(msg) .. "|r"
    if GetLocalPlayer() == forPlayer then
        ClearTextMessages()
        DisplayTimedTextToPlayer(forPlayer, 0.52, 0.9, 2, msg)
        StartSound(self.errorSound)
    end
end
function SimError.init(self)
end
SimError.errorSound = CreateSoundFromLabel("InterfaceError", false, false, false, 10, 10)
return ____exports
