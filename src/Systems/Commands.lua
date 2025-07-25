local ____exports = {}
local ____SpellHelper = require("Global.SpellHelper")
local SpellGroup = ____SpellHelper.SpellGroup
____exports.Commands = {}
local Commands = ____exports.Commands
Commands.name = "Commands"
Commands.__index = Commands
Commands.prototype = {}
Commands.prototype.__index = Commands.prototype
Commands.prototype.constructor = Commands
function Commands.new(...)
    local self = setmetatable({}, Commands.prototype)
    self:____constructor(...)
    return self
end
function Commands.prototype.____constructor(self)
end
function Commands.init(self)
    local t = CreateTrigger()
    TriggerRegisterPlayerChatEvent(
        t,
        Player(0),
        "+1",
        true
    )
    TriggerAddAction(
        t,
        function()
            GroupEnumUnitsSelected(
                SpellGroup,
                Player(0),
                nil
            )
            local u = FirstOfGroup(SpellGroup)
            SetHeroLevel(
                u,
                GetHeroLevel(u) + 1,
                true
            )
        end
    )
    t = CreateTrigger()
    TriggerRegisterPlayerChatEvent(
        t,
        Player(0),
        "+20",
        true
    )
    TriggerAddAction(
        t,
        function()
            GroupEnumUnitsSelected(
                SpellGroup,
                Player(0),
                nil
            )
            local u = FirstOfGroup(SpellGroup)
            SetHeroLevel(u, 20, true)
        end
    )
    t = CreateTrigger()
    TriggerRegisterPlayerChatEvent(
        t,
        Player(0),
        "-kill",
        true
    )
    TriggerAddAction(
        t,
        function()
            GroupEnumUnitsSelected(
                SpellGroup,
                Player(0),
                nil
            )
            local u = FirstOfGroup(SpellGroup)
            while u ~= nil do
                GroupRemoveUnit(SpellGroup, u)
                KillUnit(u)
                u = FirstOfGroup(SpellGroup)
            end
        end
    )
end
return ____exports
