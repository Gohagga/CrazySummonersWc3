local ____exports = {}
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
____exports.Flamestrike = {}
local Flamestrike = ____exports.Flamestrike
Flamestrike.name = "Flamestrike"
Flamestrike.__index = Flamestrike
Flamestrike.prototype = {}
Flamestrike.prototype.__index = Flamestrike.prototype
Flamestrike.prototype.constructor = Flamestrike
function Flamestrike.new(...)
    local self = setmetatable({}, Flamestrike.prototype)
    self:____constructor(...)
    return self
end
function Flamestrike.prototype.____constructor(self)
end
function Flamestrike.init(self)
    local t = CreateTrigger()
    SpellEvent:RegisterSpellCast(
        ____exports.Flamestrike.spellId,
        function()
            print("Flamestrike cast")
        end
    )
    SpellEvent:RegisterSpellEffect(
        ____exports.Flamestrike.spellId,
        function()
            print("Flamestrike effect")
        end
    )
    SpellEvent:RegisterSpellEnd(
        ____exports.Flamestrike.spellId,
        function()
            print("Flamestrike end")
        end
    )
end
Flamestrike.spellId = FourCC("AHfs")
return ____exports
