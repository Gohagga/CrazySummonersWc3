local ____exports = {}
local ____HeroProgression = require("Systems.HeroProgression")
local HeroProgression = ____HeroProgression.HeroProgression
local ____PaladinProgression = require("Classes.PaladinProgression")
local PaladinProgression = ____PaladinProgression.PaladinProgression
local ____Cameras = require("Systems.Cameras")
local Cameras = ____Cameras.Cameras
local ____GamePlayer = require("Systems.GamePlayer")
local GamePlayer = ____GamePlayer.GamePlayer
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____WarlockProgression = require("Classes.WarlockProgression")
local WarlockProgression = ____WarlockProgression.WarlockProgression
local ____DeathKnightProgression = require("Classes.DeathKnightProgression")
local DeathKnightProgression = ____DeathKnightProgression.DeathKnightProgression
require("Config")
____exports.HeroSelect = {}
local HeroSelect = ____exports.HeroSelect
HeroSelect.name = "HeroSelect"
HeroSelect.__index = HeroSelect
HeroSelect.prototype = {}
HeroSelect.prototype.__index = HeroSelect.prototype
HeroSelect.prototype.constructor = HeroSelect
function HeroSelect.new(...)
    local self = setmetatable({}, HeroSelect.prototype)
    self:____constructor(...)
    return self
end
function HeroSelect.prototype.____constructor(self)
end
function HeroSelect.init(self)
    local t = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SELL)
    TriggerAddAction(
        t,
        function()
            local u = GetSoldUnit()
            local owner = GetOwningPlayer(u)
            local id = GetUnitTypeId(u)
            local playerId = GetPlayerId(owner)
            if GamePlayer.Hero[playerId] then
                SetPlayerState(owner, PLAYER_STATE_RESOURCE_LUMBER, 0)
                RemoveUnit(GamePlayer.Hero[playerId])
            end
            GamePlayer.Hero[playerId] = u
            SetUnitPositionLoc(u, GamePlayer.SpawnPoint[playerId])
            UnitAddType(u, UNIT_TYPE_PEON)
            BlzDecPlayerTechResearched(
                owner,
                Upgrades.SpellCircle,
                GetPlayerTechCountSimple(Upgrades.SpellCircle, owner)
            )
            ResourceBar:ResetUpgrades(owner)
            ResourceBar:Register(
                ResourceBar.new(owner)
            )
            if id == Units.Paladin then
                HeroProgression:Register(
                    PaladinProgression.new(u)
                )
            elseif id == Units.Warlock then
                HeroProgression:Register(
                    WarlockProgression.new(u)
                )
            elseif id == Units.DeathKnight then
                HeroProgression:Register(
                    DeathKnightProgression.new(u)
                )
            end
            Cameras:SetPlayerTeamCamera(owner)
            SelectUnitForPlayerSingle(u, owner)
        end
    )
    GamePlayer.SpawnPoint[0] = GetUnitLoc(gg_unit_nDUM_0031)
    GamePlayer.SpawnPoint[2] = GetUnitLoc(gg_unit_nDUM_0031)
    GamePlayer.SpawnPoint[3] = GetUnitLoc(gg_unit_nDUM_0031)
    GamePlayer.SpawnPoint[1] = GetUnitLoc(gg_unit_nDUM_0033)
    GamePlayer.SpawnPoint[4] = GetUnitLoc(gg_unit_nDUM_0033)
    GamePlayer.SpawnPoint[6] = GetUnitLoc(gg_unit_nDUM_0033)
    GamePlayer.HeroSelect[0] = gg_unit_e000_0040
    GamePlayer.HeroSelect[2] = gg_unit_e000_0040
    GamePlayer.HeroSelect[3] = gg_unit_e000_0040
    GamePlayer.HeroSelect[1] = gg_unit_e001_0016
    GamePlayer.HeroSelect[4] = gg_unit_e001_0016
    GamePlayer.HeroSelect[6] = gg_unit_e001_0016
    local playerLeave = CreateTrigger()
    do
        local i = 0
        while i < 7 do
            SelectUnitForPlayerSingle(
                GamePlayer.HeroSelect[i],
                Player(i)
            )
            TriggerRegisterPlayerEventLeave(
                playerLeave,
                Player(i)
            )
            i = i + 1
        end
    end
    TriggerAddAction(
        playerLeave,
        function()
            print(
                tostring(
                    GetPlayerName(
                        GetTriggerPlayer()
                    )
                ) .. " left the game."
            )
        end
    )
end
return ____exports
