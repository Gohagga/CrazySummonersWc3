import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";

type UnitPriority = {
    value: number,
    index: number
}

export class Rejuvenate {
    public static SpellId: number;
    public static CorruptedBloodId: number;
    public static readonly Sfx: string = "Abilities/Spells/Demon/DarkPortal/DarkPortalTarget.mdl";
    public static CastSfx = "";
    private static FilterPlayer: player;

    private caster: unit;
    private x: number;
    private y: number;
    private maxUnits: number;
    private healing: number;
    private aoe: number;
    private timer: timer;
    private castSfx: effect;

    constructor(caster: unit, point: location, maxUnits: number, healing: number, aoe: number) {
        this.caster = caster;
        this.x = GetLocationX(point);
        this.y = GetLocationY(point);
        this.maxUnits = maxUnits;
        this.healing = healing;
        this.aoe = aoe;
        this.timer = CreateTimer();
        this.castSfx = AddSpecialEffectTarget(Rejuvenate.CastSfx, caster, "origin");
    }

    private static TargetFilter = Filter(() => {
        let u = GetFilterUnit();
        return IsUnitEnemy(u, Rejuvenate.FilterPlayer) == false &&
                IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) == false &&
                GetWidgetLife(u) > 0.405 &&
                IsUnitType(u, UNIT_TYPE_HERO) == false
    });

    private static GetUnitPriority(unit: unit) {
        let hp = GetWidgetLife(unit)
        let value = hp * 0.01 + hp / GetUnitState(unit, UNIT_STATE_MAX_LIFE) * 5.0
    
        if (GetWidgetLife(unit) >= GetUnitState(unit, UNIT_STATE_MAX_LIFE)*0.995) {
            value = value * 3.0
        }
        return value;
    }

    private static HealPriorityTargets(data: Rejuvenate) {
        this.FilterPlayer = GetOwningPlayer(data.caster);
        let units = SpellHelper.TableEnumUnitsInRange(data.x, data.y, data.aoe, this.TargetFilter);

        let priorities: UnitPriority[] = [];
        for (let i = 0; i < units.length; i++) {
            priorities.push({
                value: this.GetUnitPriority(units[i]),
                index: i
            });
        }
        priorities.sort((a: UnitPriority, b: UnitPriority) => a.value - b.value);

        for (let i = 0; i < data.maxUnits && i < priorities.length; i++) {
            let u = units[priorities[i].index];
            if (GetUnitAbilityLevel(u, this.CorruptedBloodId) < 1) {
                SetWidgetLife(u, GetWidgetLife(u) + data.healing * GetUnitState(u, UNIT_STATE_MAX_LIFE));
            }
            DestroyEffect(AddSpecialEffectTarget(this.Sfx, u, "origin"));
        }
    }

    static init(spellId: number, corruptedBloodId: number, castSfx: string) {
        this.SpellId = spellId;
        this.CorruptedBloodId = corruptedBloodId;
        this.CastSfx = castSfx;
        SpellHelper.Preload(this.SpellId);

        SpellEvent.RegisterSpellCast(this.SpellId, () => {
            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const point = GetSpellTargetLoc();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let castTime = 5.0;

            if (!ResourceBar.Get(owner).Consume([
                OrbType.White,
                OrbType.White,
                OrbType.White
            ])) return;

            let data = new Rejuvenate(caster, point, level,
                0.25,
                200 + 100 * level
            );
            TimerStart(data.timer, 1.2, true, () => {
                this.HealPriorityTargets(data);
            });

            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                PauseTimer(data.timer);
                DestroyTimer(data.timer);
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    PauseTimer(data.timer);
                    DestroyTimer(data.timer);
                    cb.Destroy();
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
    }
}