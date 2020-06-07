export class SpawnPoint {
    private static _instance: Record<number, SpawnPoint> = {};

    private x = 0;
    private y = 0;
    private spawnX = 0;
    private spawnY = 0;
    public targetX = 0;
    public targetY = 0;
    public owner: player;
    public region: rect = gg_rct_PlayArea;
    public facing: number;
    public next?: SpawnPoint;
    

    constructor(x: number, y: number, owner: player, facing: number) {
        this.x = x;
        this.y = y;
        this.spawnX = x;
        this.spawnY = y;
        this.owner = owner;
        this.facing = facing;
    }

    public static FromTarget(target: unit) {
        const unitId = GetHandleId(target);
        return this._instance[unitId];
    }
    
    public static RegisterSpawnPointTarget(unit: unit, owner: player) {
        let x = GetUnitX(unit);
        let y = GetUnitY(unit);
        const sp = new SpawnPoint(x, y, owner, 0);
        this._instance[GetHandleId(unit)] = sp;
        return sp;
    }

    public SetDestination(point: location) {
        this.targetX = GetLocationX(point);
        this.targetY = GetLocationY(point);
        return this;
    }

    public SetRegion(region: rect) {
        this.region = region;
        return this;
    }

    public Next(sp?: SpawnPoint) {
        if (sp) {
            this.next = sp;
        }
        if (this.next) return this.next;
        return this;
    }

    public get Destination() {
        return Location(this.targetX, this.targetY);
    }

    public SetSpawnPointPolarOffset(polarDirection: number, polarOffset: number) {
        this.spawnX = this.spawnX + polarOffset * Cos(polarDirection * bj_DEGTORAD)
        this.spawnY = this.spawnY + polarOffset * Sin(polarDirection * bj_DEGTORAD)
        this.facing = polarDirection;
        return this;
    }

    public GetPolarOffsetPoint(angle: number, offset: number){
        let x = this.x + offset * Cos(angle * bj_DEGTORAD);
        let y = this.y + offset * Sin(angle * bj_DEGTORAD);
        return Location(x, y);
    }

    public get Point() {
        return Location(this.spawnX, this.spawnY);
    }

    public get Position() {
        return Location(this.x, this.y);
    }

    static init() {

        let r1 = this.RegisterSpawnPointTarget(gg_unit_h001_0014, Player(5)).SetSpawnPointPolarOffset(90, 200).SetDestination(GetUnitLoc(gg_unit_h002_0009)).SetRegion(gg_rct_Lane_1);
        let r2 = this.RegisterSpawnPointTarget(gg_unit_h001_0008, Player(5)).SetSpawnPointPolarOffset(90, 200).SetDestination(GetUnitLoc(gg_unit_h002_0010)).SetRegion(gg_rct_Lane_2);
        let r3 = this.RegisterSpawnPointTarget(gg_unit_h001_0006, Player(5)).SetSpawnPointPolarOffset(90, 200).SetDestination(GetUnitLoc(gg_unit_h002_0011)).SetRegion(gg_rct_Lane_3);
        let r4 = this.RegisterSpawnPointTarget(gg_unit_h001_0004, Player(5)).SetSpawnPointPolarOffset(90, 200).SetDestination(GetUnitLoc(gg_unit_h002_0012)).SetRegion(gg_rct_Lane_4);
        let r5 = this.RegisterSpawnPointTarget(gg_unit_h001_0015, Player(5)).SetSpawnPointPolarOffset(90, 200).SetDestination(GetUnitLoc(gg_unit_h002_0013)).SetRegion(gg_rct_Lane_5);

        let b1 = this.RegisterSpawnPointTarget(gg_unit_h002_0009, Player(9)).SetSpawnPointPolarOffset(270, 200).SetDestination(GetUnitLoc(gg_unit_h001_0014)).SetRegion(gg_rct_Lane_1);
        let b2 = this.RegisterSpawnPointTarget(gg_unit_h002_0010, Player(9)).SetSpawnPointPolarOffset(270, 200).SetDestination(GetUnitLoc(gg_unit_h001_0008)).SetRegion(gg_rct_Lane_2);
        let b3 = this.RegisterSpawnPointTarget(gg_unit_h002_0011, Player(9)).SetSpawnPointPolarOffset(270, 200).SetDestination(GetUnitLoc(gg_unit_h001_0006)).SetRegion(gg_rct_Lane_3);
        let b4 = this.RegisterSpawnPointTarget(gg_unit_h002_0012, Player(9)).SetSpawnPointPolarOffset(270, 200).SetDestination(GetUnitLoc(gg_unit_h001_0004)).SetRegion(gg_rct_Lane_4);
        let b5 = this.RegisterSpawnPointTarget(gg_unit_h002_0013, Player(9)).SetSpawnPointPolarOffset(270, 200).SetDestination(GetUnitLoc(gg_unit_h001_0015)).SetRegion(gg_rct_Lane_5);

        r1.Next(r2).Next(r3).Next(r4).Next(r5).Next(r1);
        b1.Next(b2).Next(b3).Next(b4).Next(b5).Next(b1);

        ForForce(bj_FORCE_ALL_PLAYERS, () => {
            let player = GetEnumPlayer()
            if (IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING)) {
                let visibility = CreateFogModifierRect(player, FOG_OF_WAR_VISIBLE, gg_rct_PlayArea, true, false)
                FogModifierStart(visibility)
                SetPlayerFlagBJ(PLAYER_STATE_GIVES_BOUNTY, true, player)
            }
            if (GetPlayerId(player) != 5 && GetPlayerId(player) != 9) {

            }
        })
    }
}