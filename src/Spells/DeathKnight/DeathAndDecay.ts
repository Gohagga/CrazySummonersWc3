import { Dummies, Models, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup } from "Global/SpellHelper";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";

export class DeathAndDecay {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.DeathAndDecay;
    public static readonly DummyOrder = "deathanddecay";
    public static readonly HealSfx: string = "Abilities\\Weapons\\SorceressMissile\\SorceressMissile.mdl";
    public static readonly DamageSfx: string = "Abilities\\Spells\\Undead\\DeathandDecay\\DeathandDecayDamage.mdl";
    public static CastSfx = Models.CastShadow;
    public static OrbCost: OrbType[] = [];

    private radius: number;
    private damage: number;
    private healing: number;
    private duration = 0;
    private dummyCaster: unit;
    private x: number;
    private y: number;
    private timer: timer = CreateTimer();

    constructor(damage: number, healing: number, owner: player, radius: number, level: number, x: number, y: number, duration: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.duration = duration;
        this.damage = damage;
        this.healing = healing;
        this.dummyCaster = CreateUnit(owner, Units.DUMMY, 0, 0, 0);
        UnitAddAbility(this.dummyCaster, DeathAndDecay.DummySpellId);
        SetUnitAbilityLevel(this.dummyCaster, DeathAndDecay.DummySpellId, level);
        IssuePointOrder(this.dummyCaster, DeathAndDecay.DummyOrder, this.x, this.y);
        UnitApplyTimedLife(this.dummyCaster, FourCC('B000'), duration);
    }

    public Run() {
        if (!this.timer) this.timer = CreateTimer();
        TimerStart(this.timer, 1.5, true, () => {
            
            GroupEnumUnitsInRange(SpellGroup, this.x, this.y, this.radius, null);
            let u = FirstOfGroup(SpellGroup);
            while (u != null) {
                GroupRemoveUnit(SpellGroup, u);
                if (DeathAndDecay.Filter(u)) {
                    let isUndead = UnitTypeFlags.IsUnitUndead(u);
                    let maxHp = GetUnitState(u, UNIT_STATE_MAX_LIFE);
                    if (isUndead == false) {
                        // Damage living
                        UnitDamageTarget(this.dummyCaster, u, maxHp * this.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
                        DestroyEffect(AddSpecialEffectTarget(DeathAndDecay.DamageSfx, u, "origin"));
                    } else {
                        // Heal undead
                        SetWidgetLife(u, GetWidgetLife(u) + this.healing * maxHp);
                        DestroyEffect(AddSpecialEffectTarget(DeathAndDecay.HealSfx, u, "origin"));
                    }
                }
                u = FirstOfGroup(SpellGroup);
            }

            if (this.duration > 0) {
                this.duration -= 1.5;
            } else {
                this.End();
            }
        });
    }

    public End() {
        PauseTimer(this.timer);
        DestroyTimer(this.timer);
        RemoveUnit(this.dummyCaster);
    }

    public static Filter(target: unit) {
        return IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false &&
            IsUnitType(target, UNIT_TYPE_STRUCTURE) == false &&
            IsUnitType(target, UNIT_TYPE_MECHANICAL) == false &&
            IsUnitType(target, UNIT_TYPE_HERO) == false &&
            GetWidgetLife(target) > 0.405;
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Purple,
            OrbType.Purple,
            OrbType.Blue,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                done: false,

                aoe: 200 + 100 * level,
                damage: 0.05,
                healing: 0.02,
                duration: 12 + 3 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 3.5,
            };
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                let amz = new DeathAndDecay(data.damage, data.healing, owner, data.aoe, level, x, y, data.duration);
                amz.Run();
            });
            Interruptable.Register(caster, (orderId: number) => {

                if (data.done == false) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    data.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
        for (let i = 0; i < 4; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}