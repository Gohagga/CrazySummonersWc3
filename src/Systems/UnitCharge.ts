import { GamePlayer } from "./GamePlayer";
import { SpawnPoint } from "Spells/Spawn";
import { Units, Auras } from "Config";

export class UnitCharge {

    private static _instance: Record<number, UnitCharge> = {};
    private static chargingUnits: unit[] = [];

    public unit: unit;
    public destination: location;
    public origin: location;
    public action: (uc: UnitCharge) => void;

    constructor(unit: unit, action: (uc: UnitCharge) => void, destination: location, origin: location) {
        this.destination = destination;
        this.origin = origin;
        this.unit = unit;
        this.action = (uch: UnitCharge) => action(uch);
    }

    public static Register(unit: unit, action: (uc: UnitCharge) => void, spawn: SpawnPoint) {

        let uc = new UnitCharge(unit, action, spawn.Destination, spawn.Point);
        this._instance[GetHandleId(unit)] = uc;
        this.chargingUnits.push(uc.unit);
    }

    public static Reregister(unit: unit, handleId: number) {

        // Switch the previous unit reference 
        // let len = this.chargingUnits.length;
        // for (let i = 0; i < len; i++) {
        //     let u = this.chargingUnits[i];
        //     if (GetHandleId(u) == handleId) {
        //         this.chargingUnits[i] = this.chargingUnits[len - 1];
        //         this.chargingUnits.pop();
        //         break;
        //     }
        // }
        // Add the new unit to the list
        // this.chargingUnits.push(unit);
        // Switch the reference in the UnitCharge record
        if (handleId in this._instance) {
            this._instance[handleId].unit = unit;
        }
    }

    public static FromUnit(unit: unit) {
        return this._instance[GetHandleId(unit)];
    }

    public static Unregister(unit: unit) {
        delete this._instance[GetHandleId(unit)];
    }

    static init() {

        let tim = CreateTimer();
        TimerStart(tim, 0, false, () => {

            PauseTimer(tim);
            DestroyTimer(tim);
            const tRed = CreateTrigger();
            const tBlue = CreateTrigger();
            TriggerRegisterEnterRectSimple(tRed, gg_rct_Blue_Damage_Line);
            TriggerRegisterEnterRectSimple(tBlue, gg_rct_Red_Damage_Line);

            TriggerAddAction(tRed, () => {

                let u = GetTriggerUnit();
                let ownerId = GetPlayerId(GetOwningPlayer(u));
                let teamId = 1;

                if (IsUnitType(u, UNIT_TYPE_HERO) == true || GetUnitTypeId(u) == Units.DUMMY || ownerId != 5 || GetUnitAbilityLevel(u, Auras.LanePersistance) > 0) {
                    return;
                }

                if (GetUnitAbilityLevel(u, Auras.LaneDrainImmunity) < 1) {
                    for (let i = 0; i < 8; i++) {
                        if (GamePlayer.Team[i] == 2) {
                            SetWidgetLife(GamePlayer.Hero[i], GetWidgetLife(GamePlayer.Hero[i]) - 1);
                        }
                    }
                }
                RemoveUnit(u);
            });

            TriggerAddAction(tBlue, () => {

                let u = GetTriggerUnit();
                let ownerId = GetPlayerId(GetOwningPlayer(u));
                let teamId = 2;

                if (IsUnitType(u, UNIT_TYPE_HERO) == true || GetUnitTypeId(u) == Units.DUMMY || ownerId != 9 || GetUnitAbilityLevel(u, Auras.LanePersistance) > 0) {
                    return;
                }

                if (GetUnitAbilityLevel(u, Auras.LaneDrainImmunity) < 1) {
                    for (let i = 0; i < 8; i++) {
                        if (GamePlayer.Team[i] == 1) {
                            SetWidgetLife(GamePlayer.Hero[i], GetWidgetLife(GamePlayer.Hero[i]) - 1);
                        }
                    }
                }
                RemoveUnit(u);
            });
        });

        let chargeTimer = CreateTimer();
        TimerStart(chargeTimer, 1.0, true, () => {

            let n: unit[] = [];
            for (let i = 0; i < this.chargingUnits.length; i++) {
                let unit = this.chargingUnits[i];
                if (!unit) {

                    delete this._instance[GetHandleId(unit)];
                    break;
                }
                let uc = this._instance[GetHandleId(unit)];
                uc.action(uc);
                n.push(unit);
            }
            this.chargingUnits = n;
        });
    }
}