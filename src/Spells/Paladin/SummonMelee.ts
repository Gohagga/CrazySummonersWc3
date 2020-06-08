import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpawnedUnitTypes } from "Config";

export class SummonMelee {
    public static SpellId: number;
    public static Sfx: string;
    private static SpawnedType = SpawnedUnitTypes.Human.slice(0, 10);

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
                OrbType.Summoning
            ])) return;

            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let sp = SpawnPoint.FromTarget(target);
            let unitType = this.SpawnedType[level-1];
            if (!sp) return;

            let data: any = {
                loops: 10,
                spawnPoint: sp,
                unitType: unitType,
                timer: CreateTimer(),
                unit: CreateUnitAtLoc(sp.owner, unitType, sp.Point, sp.facing)
            };

            UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), sp);

            RemoveGuardPosition(data.unit);
            SetUnitVertexColor(data.unit, 255, 255, 255, 0);
            SetUnitInvulnerable(data.unit, true);

            TimerStart(data.timer, 0.1, true, () => {
                if (data.loops > 0) {
                    data.loops--;
                    SetUnitVertexColor(data.unit, 255, 255, 255, 255 - data.loops * 25);
                } else {
                    SetUnitVertexColor(data.unit, 255, 255, 255, 255);
                    PauseTimer(data.timer);
                    DestroyTimer(data.timer);
                    PauseUnit(data.unit, false);
                    SetUnitInvulnerable(data.unit, false);
                    data = null;
                }
            });
        });
    }
}