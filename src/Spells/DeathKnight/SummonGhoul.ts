import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { SpawnedUnitTypes } from "Config";
import { OrbType } from "Systems/OrbResource/OrbType";

export class SummonGhoul {
    public static SpellId: number;
    public static Sfx: string;
    private static SpawnedType = SpawnedUnitTypes.Undead.slice(0, 10);
    public static OrbCost: OrbType[] = [];

    static UnitAI(data: UnitCharge) {
        if (GetUnitCurrentOrder(data.unit) == 0) {
            let x = GetLocationX(data.destination);
            let y = GetLocationY(data.destination);
            IssuePointOrderLoc(data.unit, "attack", data.destination);
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Summoning
        ];
        SpellEvent.RegisterSpellEffect(this.SpellId, () => {
            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);

            if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

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
        for (let i = 0; i < 10; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}