require("lualib_bundle");
local ____exports = {}
____exports.SpawnPoint = {}
local SpawnPoint = ____exports.SpawnPoint
SpawnPoint.name = "SpawnPoint"
SpawnPoint.__index = SpawnPoint
SpawnPoint.prototype = {}
SpawnPoint.prototype.____getters = {}
SpawnPoint.prototype.__index = __TS__Index(SpawnPoint.prototype)
SpawnPoint.prototype.constructor = SpawnPoint
function SpawnPoint.new(...)
    local self = setmetatable({}, SpawnPoint.prototype)
    self:____constructor(...)
    return self
end
function SpawnPoint.prototype.____constructor(self, x, y, owner, facing)
    self.x = 0
    self.y = 0
    self.spawnX = 0
    self.spawnY = 0
    self.targetX = 0
    self.targetY = 0
    self.region = gg_rct_PlayArea
    self.x = x
    self.y = y
    self.spawnX = x
    self.spawnY = y
    self.owner = owner
    self.facing = facing
end
function SpawnPoint.prototype.____getters.Destination(self)
    return Location(self.targetX, self.targetY)
end
function SpawnPoint.prototype.____getters.Point(self)
    return Location(self.spawnX, self.spawnY)
end
function SpawnPoint.prototype.____getters.Position(self)
    return Location(self.x, self.y)
end
function SpawnPoint.FromTarget(self, target)
    local unitId = GetHandleId(target)
    return self._instance[unitId]
end
function SpawnPoint.RegisterSpawnPointTarget(self, unit, owner)
    local x = GetUnitX(unit)
    local y = GetUnitY(unit)
    local sp = ____exports.SpawnPoint.new(x, y, owner, 0)
    self._instance[GetHandleId(unit)] = sp
    return sp
end
function SpawnPoint.prototype.SetDestination(self, point)
    self.targetX = GetLocationX(point)
    self.targetY = GetLocationY(point)
    return self
end
function SpawnPoint.prototype.SetRegion(self, region)
    self.region = region
    return self
end
function SpawnPoint.prototype.Next(self, sp)
    if sp then
        self.next = sp
    end
    if self.next then
        return self.next
    end
    return self
end
function SpawnPoint.prototype.SetSpawnPointPolarOffset(self, polarDirection, polarOffset)
    self.spawnX = self.spawnX + polarOffset * Cos(polarDirection * bj_DEGTORAD)
    self.spawnY = self.spawnY + polarOffset * Sin(polarDirection * bj_DEGTORAD)
    self.facing = polarDirection
    return self
end
function SpawnPoint.prototype.GetPolarOffsetPoint(self, angle, offset)
    local x = self.x + offset * Cos(angle * bj_DEGTORAD)
    local y = self.y + offset * Sin(angle * bj_DEGTORAD)
    return Location(x, y)
end
function SpawnPoint.init(self)
    local r1 = self:RegisterSpawnPointTarget(
        gg_unit_h001_0014,
        Player(5)
    ):SetSpawnPointPolarOffset(90, 200):SetDestination(
        GetUnitLoc(gg_unit_h002_0009)
    ):SetRegion(gg_rct_Lane_1)
    local r2 = self:RegisterSpawnPointTarget(
        gg_unit_h001_0008,
        Player(5)
    ):SetSpawnPointPolarOffset(90, 200):SetDestination(
        GetUnitLoc(gg_unit_h002_0010)
    ):SetRegion(gg_rct_Lane_2)
    local r3 = self:RegisterSpawnPointTarget(
        gg_unit_h001_0006,
        Player(5)
    ):SetSpawnPointPolarOffset(90, 200):SetDestination(
        GetUnitLoc(gg_unit_h002_0011)
    ):SetRegion(gg_rct_Lane_3)
    local r4 = self:RegisterSpawnPointTarget(
        gg_unit_h001_0004,
        Player(5)
    ):SetSpawnPointPolarOffset(90, 200):SetDestination(
        GetUnitLoc(gg_unit_h002_0012)
    ):SetRegion(gg_rct_Lane_4)
    local r5 = self:RegisterSpawnPointTarget(
        gg_unit_h001_0015,
        Player(5)
    ):SetSpawnPointPolarOffset(90, 200):SetDestination(
        GetUnitLoc(gg_unit_h002_0013)
    ):SetRegion(gg_rct_Lane_5)
    local b1 = self:RegisterSpawnPointTarget(
        gg_unit_h002_0009,
        Player(9)
    ):SetSpawnPointPolarOffset(270, 200):SetDestination(
        GetUnitLoc(gg_unit_h001_0014)
    ):SetRegion(gg_rct_Lane_1)
    local b2 = self:RegisterSpawnPointTarget(
        gg_unit_h002_0010,
        Player(9)
    ):SetSpawnPointPolarOffset(270, 200):SetDestination(
        GetUnitLoc(gg_unit_h001_0008)
    ):SetRegion(gg_rct_Lane_2)
    local b3 = self:RegisterSpawnPointTarget(
        gg_unit_h002_0011,
        Player(9)
    ):SetSpawnPointPolarOffset(270, 200):SetDestination(
        GetUnitLoc(gg_unit_h001_0006)
    ):SetRegion(gg_rct_Lane_3)
    local b4 = self:RegisterSpawnPointTarget(
        gg_unit_h002_0012,
        Player(9)
    ):SetSpawnPointPolarOffset(270, 200):SetDestination(
        GetUnitLoc(gg_unit_h001_0004)
    ):SetRegion(gg_rct_Lane_4)
    local b5 = self:RegisterSpawnPointTarget(
        gg_unit_h002_0013,
        Player(9)
    ):SetSpawnPointPolarOffset(270, 200):SetDestination(
        GetUnitLoc(gg_unit_h001_0015)
    ):SetRegion(gg_rct_Lane_5)
    r1:Next(r2):Next(r3):Next(r4):Next(r5):Next(r1)
    b1:Next(b2):Next(b3):Next(b4):Next(b5):Next(b1)
    ForForce(
        bj_FORCE_ALL_PLAYERS,
        function()
            local player = GetEnumPlayer()
            if IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING) then
                local visibility = CreateFogModifierRect(player, FOG_OF_WAR_VISIBLE, gg_rct_PlayArea, true, false)
                FogModifierStart(visibility)
                SetPlayerFlagBJ(PLAYER_STATE_GIVES_BOUNTY, true, player)
            end
            if GetPlayerId(player) ~= 5 and GetPlayerId(player) ~= 9 then
            end
        end
    )
end
SpawnPoint._instance = {}
return ____exports
