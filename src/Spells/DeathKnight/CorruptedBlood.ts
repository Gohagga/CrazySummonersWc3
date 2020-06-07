import { Buffs, Dummies, Models, SpawnedUnitTypes, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup, SpellHelper } from "Global/SpellHelper";
import { OrbCostToString, OrbType } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";

export class CorruptedBlood {
    private static _instance: Record<number, CorruptedBlood> = {};
    public static SpellId: number;
    public static DummySpellId = Dummies.CorruptedBlood;
    public static DummyOrder = "unholyfrenzy";
    public static readonly Sfx: string = "Abilities\\Spells\\Undead\\AnimateDead\\AnimateDeadTarget.mdl";
    public static readonly TargetSfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlTarget.mdl";
    public static CastSfx = Models.CastSacrifice;
    private static SpawnedType = SpawnedUnitTypes.Undead.slice(10);
    private static Aoe = [ 250, 250, 250, 250, 250 ];
    public static OrbCost: OrbType[] = [];

    private owner: player;
    private level: number;

    constructor(target: unit, level: number, owner: player) {
        this.owner = owner;
        this.level = level;
    }

    static Filter(target: unit) {
        return IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false &&
                GetWidgetLife(target) > 0.405 && 
                IsUnitType(target, UNIT_TYPE_STRUCTURE) == false &&
                IsUnitType(target, UNIT_TYPE_MECHANICAL) == false &&
                IsUnitType(target, UNIT_TYPE_HERO) == false;
    }

    static Apply(target: unit, owner: player, level: number) {
        let dummyLvl = level;
        if (GetUnitTypeId(target) == Units.VolatileLeeches) {
            dummyLvl = 5;
        }
        SpellHelper.DummyCastTarget(owner, GetUnitX(target), GetUnitY(target), target, CorruptedBlood.DummySpellId, dummyLvl, CorruptedBlood.DummyOrder);
        UnitAddType(target, UNIT_TYPE_SAPPER);
        this._instance[GetHandleId(target)] = new CorruptedBlood(target, level, owner);
    }

    static RemoveBuff(target: unit) {
        UnitRemoveAbility(target, Buffs.CorruptedBlood);
        UnitRemoveType(target, UNIT_TYPE_SAPPER);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Red,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let life = GetUnitState(target, UNIT_STATE_MAX_LIFE);

            let data = {
                done: false,

                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                // targetSfx: AddSpecialEffectTarget(this.TargetSfx, target, "origin"),
                damage: life * (0.35 + 0.15 * level),
                threshold: 0.9 - 0.1 * level,
                castTime: 1.5
            }
            BlzSetSpecialEffectScale(data.castSfx, 2.2);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);
                // DestroyEffect(data.targetSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;
                
                DestroyEffect(AddSpecialEffectTarget(this.Sfx, target, "chest"));
                this.Apply(target, owner, level);
            });
            Interruptable.Register(caster, () => {

                if (!data.done) {
                    DestroyEffect(data.castSfx);
                    // DestroyEffect(data.targetSfx);
                    cb.Destroy();
                    data.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH);
        TriggerAddAction(t, () => {

            const target = GetTriggerUnit();
            let instance = this._instance[GetHandleId(target)];
            if (!instance) return;

            let level = instance.level;
            let owner = instance.owner;
            let aoe = 250;//this.Aoe[level - 1];
            // let explosion = GetUnitTypeId(target) == Units.VolatileLeeches;
            GroupEnumUnitsInRange(SpellGroup, GetUnitX(target), GetUnitY(target), aoe, null);
            let u = FirstOfGroup(SpellGroup);
            while (u != null) {
                GroupRemoveUnit(SpellGroup, u);
                if (this.Filter(u)) {
                    this.Apply(u, owner, level);
                }
                u = FirstOfGroup(SpellGroup);
            }
        });
        for (let i = 0; i < 4; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}