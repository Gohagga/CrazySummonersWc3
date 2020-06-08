import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { Auras, Models } from "Config";

export class BloodFeast {
    public static SpellId: number;
    public static AuraHp = Auras.BloodFeastHpBonus;
    public static AuraDamage = Auras.BloodFeastDamageBonus;
    public static readonly CasterSfx: string = "Abilities\\Spells\\Orc\\FeralSpirit\\feralspirittarget.mdl";
    public static readonly TargetSfx: string = Models.MassTeleportDemon;
    public static CastSfx = Models.CastSacrifice;

    private lifePerTick = 0;
    private attackPerTick = 0;
    private minimumHealth = 4;
    private timer = CreateTimer();
    private owner: player;
    private caster: unit;

    constructor(caster: unit, lifePerTick: number, hpBonus: number, attack: number) {
        this.caster = caster;
        this.owner = GetOwningPlayer(caster);
        this.lifePerTick = lifePerTick;
        this.attackPerTick = attack;
    }

    public Run(interval: number) {
        TimerStart(this.timer, interval, false, () => {

            let unitWasBuffed = false;
            GroupEnumUnitsInRect(SpellGroup, gg_rct_Battleground, null);
            let u = FirstOfGroup(SpellGroup);
            while (u != null) {
                GroupRemoveUnit(SpellGroup, u);

                if (BloodFeast.Filter(u, this.owner)) {
                    // Apply the bonus effect
                    BloodFeast.BuffUnit(this, u);
                    unitWasBuffed = true;
                }
                u = FirstOfGroup(SpellGroup);
            }
            if (unitWasBuffed) {
                UnitDamageTarget(this.caster, this.caster, 1, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
            }
            if (GetWidgetLife(this.caster) < this.minimumHealth) {
                IssueImmediateOrder(this.caster, "stop");
            }
            this.Run(2);
        });
    }

    public End() {
        PauseTimer(this.timer);
        DestroyTimer(this.timer);
    }

    private static BuffUnit(bf: BloodFeast, u: unit) {
        let stacks = 0;
        let aLvl = GetUnitAbilityLevel(u, this.AuraDamage);
        let tLvl = 0;
        if (aLvl < 20) {
            stacks = math.floor((aLvl + 3) / 4);
            // print("alvl, stacks", aLvl, stacks);
            if (stacks == 0) {
                UnitAddAbility(u, this.AuraDamage);
                tLvl = bf.attackPerTick;
            } else if (stacks < 5) {
                tLvl = math.floor(stacks * 4 + bf.attackPerTick);
            } else {
                tLvl = 16 + bf.attackPerTick;
            }
            SetUnitAbilityLevel(u, this.AuraDamage, tLvl);

            if (stacks == 5) {
                UnitAddAbility(u, this.AuraHp);
                SetUnitAbilityLevel(u, this.AuraHp, aLvl - 11);
                UnitRemoveAbility(u, this.AuraHp);
            }
            UnitAddAbility(u, this.AuraHp);
            SetUnitAbilityLevel(u, this.AuraHp, bf.lifePerTick);
            UnitRemoveAbility(u, this.AuraHp);
            DestroyEffect(AddSpecialEffectTarget(BloodFeast.TargetSfx, u, "origin"));
        }
        SetWidgetLife(u, GetWidgetLife(u) + 50 * bf.lifePerTick);
    }

    public static Filter(target: unit, owner: player) {
        return (
            UnitTypeFlags.IsUnitDemon(target) ||
            UnitTypeFlags.IsUnitHorror(target)) &&
            (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            
            if (!ResourceBar.Get(owner).Consume([
                OrbType.Purple,
                OrbType.Purple,
                OrbType.Red,
                OrbType.Red
            ])) return;

            let data = {
                minimumHealth: 4,
                hpBonus: 1 + level,
                attackBonus: level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 10,
                tickDuration: 1,
                timer: CreateTimer()
            }
            // BlzSetSpecialEffectScale(data.castSfx, 2.2);

            let bf = new BloodFeast(caster, data.hpBonus, data.hpBonus, data.attackBonus);
            bf.Run(1);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                bf.End();
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    bf.End();
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
    }
}