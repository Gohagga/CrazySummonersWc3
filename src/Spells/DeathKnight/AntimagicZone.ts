import { Auras, Buffs, Dummies, Models, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup, TempGroup } from "Global/SpellHelper";
import { OrbCostToString, OrbType } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";

export class AntimagicZone {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.AntimagicZone;
    public static readonly DummyOrder = "cloudoffog";
    public static readonly Aura = Auras.AmzSpellImmunity;
    public static readonly BuffId = Buffs.AntimagicZone;
    public static readonly Sfx: string = Models.ForceField;
    public static CastSfx = Models.CastUnholy;
    public static OrbCost: OrbType[] = [];

    private units: group = CreateGroup();
    private radius: number;
    private duration = 0;
    private silenceCaster: unit;
    private x: number;
    private y: number;
    private timer: timer = CreateTimer();
    private sfx: effect;

    constructor(owner: player, radius: number, level: number, x: number, y: number, duration: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.duration = duration;
        this.sfx = AddSpecialEffect(AntimagicZone.Sfx, x, y);
        BlzSetSpecialEffectScale(this.sfx, 0.0033 * radius);
        this.silenceCaster = CreateUnit(owner, Units.DUMMY, 0, 0, 0);
        UnitAddAbility(this.silenceCaster, AntimagicZone.DummySpellId);
        SetUnitAbilityLevel(this.silenceCaster, AntimagicZone.DummySpellId, level);
        IssuePointOrder(this.silenceCaster, AntimagicZone.DummyOrder, this.x, this.y);
        UnitApplyTimedLife(this.silenceCaster, FourCC('B000'), duration);
    }

    public Run() {
        if (!this.timer) this.timer = CreateTimer();
        TimerStart(this.timer, 0.25, true, () => {
            
            GroupEnumUnitsInRange(SpellGroup, this.x, this.y, this.radius, null);
            GroupClear(TempGroup);
            GroupAddGroup(this.units, TempGroup);

            let u = FirstOfGroup(TempGroup);
            while (u != null) {
                GroupRemoveUnit(TempGroup, u);
                if (AntimagicZone.Filter(u)) {
                    // Exit zone
                    if (GetUnitAbilityLevel(u, AntimagicZone.BuffId) < 1 || IsUnitInGroup(u, SpellGroup) == false) {
                        this.RemoveBuffs(u);
                    }
                }
                u = FirstOfGroup(TempGroup);
            }

            u = FirstOfGroup(SpellGroup);
            while (u != null) {
                GroupRemoveUnit(SpellGroup, u);
                if (AntimagicZone.Filter(u)) {
                    // Exit zone
                    if (IsUnitInGroup(u, this.units) == false) {
                        this.AddBuffs(u);
                    }
                }
                u = FirstOfGroup(SpellGroup);
            }

            if (this.duration > 0) {
                this.duration -= 0.25;
            } else {
                this.End();
            }
        });
    }

    public End() {
        DestroyEffect(this.sfx);
        PauseTimer(this.timer);
        DestroyTimer(this.timer);
    }

    public AddBuffs(u: unit) {
        UnitAddAbility(u, AntimagicZone.Aura);
        GroupAddUnit(this.units, u);
    }

    public RemoveBuffs(u: unit) {
        UnitRemoveAbility(u, AntimagicZone.Aura);
        UnitRemoveAbility(u, AntimagicZone.BuffId);
        GroupRemoveUnit(this.units, u);
    }

    public static Filter(target: unit) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Blue,
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

                aoe: 250 + 50 * level,
                duration: 5 + 5 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 2.5,
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                let amz = new AntimagicZone(owner, data.aoe, level, x, y, data.duration);
                amz.Run();
            });
            Interruptable.Register(caster, () => {

                if (!data.done) {
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