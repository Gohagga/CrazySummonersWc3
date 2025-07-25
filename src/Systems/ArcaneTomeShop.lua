local ____exports = {}
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Orb = require("Systems.OrbResource.Orb")
local OrbType = ____Orb.OrbType
require("Config")
____exports.ArcaneTomeShop = {}
local ArcaneTomeShop = ____exports.ArcaneTomeShop
ArcaneTomeShop.name = "ArcaneTomeShop"
ArcaneTomeShop.__index = ArcaneTomeShop
ArcaneTomeShop.prototype = {}
ArcaneTomeShop.prototype.__index = ArcaneTomeShop.prototype
ArcaneTomeShop.prototype.constructor = ArcaneTomeShop
function ArcaneTomeShop.new(...)
    local self = setmetatable({}, ArcaneTomeShop.prototype)
    self:____constructor(...)
    return self
end
function ArcaneTomeShop.prototype.____constructor(self)
end
function ArcaneTomeShop.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_PICKUP_ITEM)
    TriggerAddAction(
        t,
        function()
            local bar = ResourceBar:Get(
                GetOwningPlayer(
                    GetTriggerUnit()
                )
            )
            local ____type = ({[Items.GemWhite] = OrbType.White, [Items.GemBlue] = OrbType.Blue, [Items.GemRed] = OrbType.Red, [Items.GemPurple] = OrbType.Purple, [Items.GemSummoning] = OrbType.Summoning})[GetItemTypeId(
                GetManipulatedItem()
            )]
            if ____type == OrbType.White then
                bar:AddOrb(____type)
            elseif ____type == OrbType.Blue then
                bar:AddOrb(____type)
            elseif ____type == OrbType.Red then
                bar:AddOrb(____type)
            elseif ____type == OrbType.Purple then
                bar:AddOrb(____type)
            elseif ____type == OrbType.Summoning then
                bar:AddOrb(____type)
            end
        end
    )
end
return ____exports
