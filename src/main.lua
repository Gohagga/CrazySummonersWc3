local ____index = require("node_modules.war3-library-loader.src.index")
local LibraryLoader = ____index.LibraryLoader
local ____Spells = require("Modules.Spells")
local InitializeSpells = ____Spells.InitializeSpells
local PreloadSpells = ____Spells.PreloadSpells
local ____Globals = require("Modules.Globals")
local InitializeGlobals = ____Globals.InitializeGlobals
local ____SpellEvent = require("Global.SpellEvent")
local SpellEvent = ____SpellEvent.SpellEvent
local ____HeroSelect = require("Systems.HeroSelect")
local HeroSelect = ____HeroSelect.HeroSelect
local ____Spawn = require("Spells.Spawn")
local SpawnPoint = ____Spawn.SpawnPoint
local ____Cameras = require("Systems.Cameras")
local Cameras = ____Cameras.Cameras
local ____UnitCharge = require("Systems.UnitCharge")
local UnitCharge = ____UnitCharge.UnitCharge
local ____HeroProgression = require("Systems.HeroProgression")
local HeroProgression = ____HeroProgression.HeroProgression
local ____GamePlayer = require("Systems.GamePlayer")
local GamePlayer = ____GamePlayer.GamePlayer
local ____OrbView = require("Systems.OrbResource.OrbView")
local OrbView = ____OrbView.OrbView
local ____ResourceBar = require("Systems.OrbResource.ResourceBar")
local ResourceBar = ____ResourceBar.ResourceBar
local ____Interruptable = require("Global.Interruptable")
local Interruptable = ____Interruptable.Interruptable
local ____Commands = require("Systems.Commands")
local Commands = ____Commands.Commands
local ____ArcaneTomeShop = require("Systems.ArcaneTomeShop")
local ArcaneTomeShop = ____ArcaneTomeShop.ArcaneTomeShop
local ____PaladinMastery = require("Classes.PaladinMastery")
local PaladinMastery = ____PaladinMastery.PaladinMastery
local ____GameRound = require("Systems.GameRound")
local GameRound = ____GameRound.GameRound
local ____UnitTypeFlags = require("Global.UnitTypeFlags")
local UnitTypeFlags = ____UnitTypeFlags.UnitTypeFlags
local ____DeathKnightMightWill = require("Classes.DeathKnightMightWill")
local DeathKnightMightWill = ____DeathKnightMightWill.DeathKnightMightWill
require("Config")
function tsMain()
    GamePlayer:init()
    SpellEvent:init()
    Interruptable:init()
    SpawnPoint:init()
    HeroProgression:init()
    HeroSelect:init()
    UnitCharge:init()
    GameRound:init()
    UnitTypeFlags:init()
    PaladinMastery:init()
    DeathKnightMightWill:init()
    Cameras:init()
    Commands:init()
    ArcaneTomeShop:init()
    TimerStart(
        CreateTimer(),
        0.1,
        false,
        function()
            OrbView:init()
            ResourceBar:init()
            InitializeGlobals()
            InitializeSpells()
        end
    )
    PreloadSpells()
end
function libLoaderLog(libName, success, message)
    print(
        "Initializing \"" .. tostring(libName) .. "\": " .. tostring(success and "Success" or "Failure") .. ", \"" .. tostring(message) .. "\""
    )
end
LibraryLoader.logFunction = libLoaderLog
ceres.addHook(
    "main::after",
    function() return LibraryLoader:runInitializers() end
)
ceres.addHook(
    "main::after",
    function() return tsMain() end
)
