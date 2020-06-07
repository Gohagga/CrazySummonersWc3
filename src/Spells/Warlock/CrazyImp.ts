import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Models, Units } from "Config";

export class CrazyImp {
    public static SpellId: number;
    public static CastSfx: string = Models.CastSummoning;
    public static Sfx: string = Models.CastSummoningInstant;
    private static UnitSpawned: number[] = [
        Units.CrazyImp1,
        Units.CrazyImp2,
        Units.CrazyImp3,
        Units.CrazyImp4
    ];

    static UnitAI(data: UnitCharge) {
        if (GetUnitCurrentOrder(data.unit) == 0) {
            let x = GetLocationX(data.destination);
            let y = GetLocationY(data.destination);
            IssuePointOrderLoc(data.unit, "attack", data.destination);
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let sp = SpawnPoint.FromTarget(target);
            if (!sp) return;
            let unitType = this.UnitSpawned[level - 1];

            let data: any = {
                loops: 10,
                spawnPoint: sp,
                unitType: unitType,
                timer: CreateTimer(),
                castTime: 4 - 0.5 * level,
                sp: sp,
                castSfx: AddSpecialEffect(this.CastSfx, GetUnitX(caster), GetUnitY(caster))
            };
            BlzSetSpecialEffectScale(data.castSfx, 2);

            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Purple,
                    OrbType.Summoning
                ])) return;

                // Create the unit
                data.unit = CreateUnitAtLoc(data.sp.owner, unitType, data.sp.Point, data.sp.facing),
                UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), data.sp);

                RemoveGuardPosition(data.unit);
                SetUnitVertexColor(data.unit, 255, 255, 255, 0);
                SetUnitInvulnerable(data.unit, true);

                AddSpecialEffect(this.Sfx, GetUnitX(data.unit), GetUnitY(data.unit));
                TimerStart(data.timer, 0.1, true, () => {
                    if (data.loops > 0) {
                        data.loops--;
                        SetUnitVertexColor(data.unit, 255, 255, 255, 255 - data.loops * 25);
                    } else {
                        SetUnitVertexColor(data.unit, 255, 255, 255, 255);
                        SetUnitInvulnerable(data.unit, false);
    
                        PauseTimer(data.timer);
                        DestroyTimer(data.timer);
                        PauseUnit(data.unit, false);
                        data = null;
                    }
                });
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });

        });
    }
}