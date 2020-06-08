import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { WardSpell } from "Systems/WardSpell";
import { SpellHelper } from "Global/SpellHelper";
import { Auras, Models, Units, Spells } from "Config";

export class DarkPortal extends WardSpell {
    public static SpellId: number;
    public static AuraHp = Auras.DarkPortalLifeBonus;
    public static CastSfx: string = Models.CastSummoning;
    public static Sfx: string = Models.CastSummoning;
    public static UnitId = Units.DarkPortal;
    private static UnitSpawned: number[] = [
        Units.CrazyImp1,
        Units.CrazyImp2,
        Units.CrazyImp3,
        Units.CrazyImp4
    ];

    private unit: unit;
    private timer: timer;
    private spawnPoint: SpawnPoint;

    constructor(darkPortal: unit, spawnPoint: SpawnPoint) {
        super();
        this.unit = darkPortal;
        this.spawnPoint = spawnPoint;
        this.timer = CreateTimer();
        this.onDestroy = () => {
            this.Destroy();
        };
    }

    private Destroy() {
        KillUnit(this.unit);
        PauseTimer(this.timer);
        DestroyTimer(this.timer);
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
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let wt = WardSpell.FromTarget(target);
            let sp = SpawnPoint.FromTarget(target);
            if (!wt || !sp) return;
            let unitType = this.UnitSpawned[level - 1];

            let data: any = {
                unitType: unitType,
                castTime: 4 - 0.5 * level,
                duration: 20 + level * 10,
                manaRequired: 9.8,
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
                    OrbType.Purple,
                    OrbType.Red,
                    OrbType.Summoning
                ])) return;
                
                // Create the unit
                let darkPortal = CreateUnitAtLoc(sp.owner, this.UnitId, data.sp.GetPolarOffsetPoint(data.sp.facing, 140), data.sp.facing);
                UnitAddAbility(darkPortal, this.AuraHp);
                SetUnitAbilityLevel(darkPortal, this.AuraHp, level);
                UnitRemoveAbility(darkPortal, this.AuraHp);
                let spawnPoint = SpawnPoint.RegisterSpawnPointTarget(darkPortal, data.sp.owner);
                spawnPoint.SetDestination(sp.Destination);
                spawnPoint.SetSpawnPointPolarOffset(data.sp.facing, 100);
                let ward = new DarkPortal(darkPortal, spawnPoint);
                WardSpell.ApplyWard(target, ward);
                UnitApplyTimedLife(darkPortal, FourCC("B000"), data.duration);
                data.unit = darkPortal;

                TimerStart(ward.timer, 0.5, true, () => {

                    if (GetUnitState(darkPortal, UNIT_STATE_MANA) >= data.manaRequired) {
                        ResourceBar.Get(owner).ForceCast(() => {
                            
                            SpellHelper.DummyCastTarget(owner, GetUnitX(darkPortal), GetUnitY(darkPortal), darkPortal, Spells.SummonEvilOutsider, level, "acidbomb");
                            SetUnitState(darkPortal, UNIT_STATE_MANA, 0);
                        });
                    } else if (GetWidgetLife(darkPortal) <= 0.405) {
                        ward.Destroy();
                    }
                });
                IssueImmediateOrder(caster, "stop");
                QueueUnitAnimation(caster, "spell");
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