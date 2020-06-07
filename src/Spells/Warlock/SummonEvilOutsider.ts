import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { SpawnedUnitTypes, Buffs } from "Config";

export class SummonEvilOutsider {
    public static SpellId: number;
    public static Sfx: string;
    private static DemonTypeMelee = SpawnedUnitTypes.Demon.slice(0, 10);
    private static DemonTypeRanged = SpawnedUnitTypes.Demon.slice(10);
    private static HorrorType = SpawnedUnitTypes.Horror;
    private static HorrorVertexColor: Record<number, {r: number, g: number, b: number}> = {
        1: { r: 0, g: 0, b: 0 },
        2: { r: 30, g: 0, b: 30 },
        3: { r: 255, g: 255, b: 255 },
        4: { r: 0, g: 0, b: 0 },
        5: { r: 0, g: 0, b: 0 },
        6: { r: 0, g: 0, b: 0 },
        7: { r: 100, g: 30, b: 100 },
        8: { r: 0, g: 0, b: 0 },
        9: { r: 0, g: 0, b: 0 },
    }

    static UnitAI(data: UnitCharge) {
        if (GetUnitCurrentOrder(data.unit) == 0) {
            let x = GetLocationX(data.destination);
            let y = GetLocationY(data.destination);
            IssuePointOrderLoc(data.unit, "attack", data.destination);
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        SpellEvent.RegisterSpellEffect(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);

            if (!ResourceBar.Get(owner).Consume([
                OrbType.Summoning,
                OrbType.Summoning
            ])) return;

            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let sp = SpawnPoint.FromTarget(target);
            if (!sp) return;
            let unitType = -1;
            let unitTypeRanged = -1;
            let color = { r: 255, g: 255, b: 255 };

            if (GetUnitAbilityLevel(caster, Buffs.Shadowcraft) > 0) {
                if (level > 9) level = 9;
                unitType = this.HorrorType[level-1];
                color = this.HorrorVertexColor[level];
            } else {
                unitType = this.DemonTypeMelee[level-1];
            } 
            if (GetUnitAbilityLevel(caster, Buffs.Demonism) > 0) {
                unitTypeRanged = this.DemonTypeRanged[level-1];
            }

            let data: any = {
                loops: 10,
                spawnPoint: sp,
                unitType: unitType,
                unitTypeRanged: unitTypeRanged,
                timer: CreateTimer(),
                unit: CreateUnitAtLoc(sp.owner, unitType, sp.Point, sp.facing),
            };

            UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), sp);
            RemoveGuardPosition(data.unit);
            SetUnitVertexColor(data.unit, color.r, color.g, color.b, 0);
            SetUnitInvulnerable(data.unit, true);

            if (data.unitTypeRanged != -1) {
                data.unit2 = CreateUnitAtLoc(sp.owner, unitTypeRanged, sp.Point, sp.facing);
                UnitCharge.Register(data.unit2, (uc: UnitCharge) => this.UnitAI(uc), sp);
                RemoveGuardPosition(data.unit2);
                SetUnitVertexColor(data.unit2, 255, 255, 255, 0);
                SetUnitInvulnerable(data.unit2, true);
            }

            TimerStart(data.timer, 0.1, true, () => {
                if (data.loops > 0) {
                    data.loops--;
                    SetUnitVertexColor(data.unit, color.r, color.g, color.b, 255 - data.loops * 25);
                    if (data.unit2) SetUnitVertexColor(data.unit2, 255, 255, 255, 255 - data.loops * 25);
                } else {
                    SetUnitVertexColor(data.unit, color.r, color.g, color.b, 255);
                    SetUnitInvulnerable(data.unit, false);
                    if (data.unit2) {
                        SetUnitVertexColor(data.unit2, 255, 255, 255, 255);
                        SetUnitInvulnerable(data.unit2, false);
                    }
                    PauseTimer(data.timer);
                    DestroyTimer(data.timer);
                    PauseUnit(data.unit, false);
                    data = null;
                }
            });
        });
    }
}