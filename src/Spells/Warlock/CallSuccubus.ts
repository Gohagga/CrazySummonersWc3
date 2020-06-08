import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { SpellGroup } from "Global/SpellHelper";
import { Order } from "Global/Order";
import { Models, Units } from "Config";

export class CallSuccubus {
    public static SpellId: number;
    public static DummyOrder: string = "charm";
    public static CastSfx: string = Models.CastSummoning;
    public static Sfx: string = Models.CastSummoningInstant;
    private static UnitSpawned: Record<number, number> = {
        1: Units.Succubus1,
        2: Units.Succubus2,
        3: Units.Succubus3,
        4: Units.Succubus4
    };

    static Filter(target: unit, owner: player) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitAlly(target, owner) == false) &&
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (GetWidgetLife(target) > 0.405);
    }

    static UnitAI(data: UnitCharge) {
        if (GetUnitState(data.unit, UNIT_STATE_MANA) >= 24.5) {
            let owner = GetOwningPlayer(data.unit);
            GroupEnumUnitsInRange(SpellGroup, GetUnitX(data.unit), GetUnitY(data.unit), 700, null);
            let u = FirstOfGroup(SpellGroup);
            let notCast = true;
            while (u != null && notCast) {
                GroupRemoveUnit(SpellGroup, u);
                if (this.Filter(u, owner)) {
                    IssueTargetOrder(data.unit, this.DummyOrder, u);
                    SetUnitState(data.unit, UNIT_STATE_MANA, 0);
                    UnitCharge.FromUnit(u).destination = data.destination;
                    notCast = false;
                }
                u = FirstOfGroup(SpellGroup);
            }
        } else if (GetUnitCurrentOrder(data.unit) == 0) {
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
            let unitType = this.UnitSpawned[level];

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
                    OrbType.Red,
                    OrbType.Summoning
                ])) return;

                // Create the unit
                data.unit = CreateUnitAtLoc(data.sp.owner, unitType, data.sp.Point, data.sp.facing),
                UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), sp);

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