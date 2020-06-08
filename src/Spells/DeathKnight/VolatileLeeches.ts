import { Auras, Buffs, Models, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup } from "Global/SpellHelper";
import { SpawnPoint } from "Spells/Spawn";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { UnitCharge } from "Systems/UnitCharge";
import { OrbType } from "Systems/OrbResource/OrbType";

export class VolatileLeeches {
    public static SpellId: number;
    public static DummyOrder: string = "charm";
    public static AuraDamage: number = Auras.VolatileLeechesDamage;
    public static AuraBites: number = Auras.VolatileLeechesBites;
    public static CastSfx: string = Models.CastSacrifice;
    public static ExplodeSfx: string = Models.BloodExplosion;
    private static UnitSpawned = Units.VolatileLeeches;
    public static OrbCost: OrbType[] = [];

    private static SpawnMap = [
        // Begins with middle
        [1, 1, 0, 0, 1],
        [2, 1, 0, 0, 1],
        [2, 2, 0, 0, 2],
        [2, 2, 1, 1, 2],
    ];

    static HealFilter(target: unit, owner: player) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitAlly(target, owner)) &&
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (GetUnitAbilityLevel(target, Buffs.CorruptedBlood) < 1) &&
            (GetWidgetLife(target) > 0.405);
    }

    static DamageFilter(target: unit) {
        return IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false &&
        IsUnitType(target, UNIT_TYPE_STRUCTURE) == false &&
        IsUnitType(target, UNIT_TYPE_MECHANICAL) == false &&
        IsUnitType(target, UNIT_TYPE_HERO) == false &&
        GetWidgetLife(target) > 0.405;
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
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Summoning
        ];
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let sp = SpawnPoint.FromTarget(target);
            if (!sp) return;
            let unitType = this.UnitSpawned;

            let data: any = {
                done: false,

                loops: 10,
                spawnPoint: sp,
                timer: CreateTimer(),
                castTime: 2,
                sp: sp,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin")
            };

            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                // Create the units
                let units = [];
                let next: SpawnPoint | undefined = sp;
                let spawnMap = this.SpawnMap[level-1];
                for (let n of spawnMap) {

                    if (!next) {
                        break;
                    }
                    for (let i = 0; i < n; i++) {
                        
                        let u = CreateUnitAtLoc(next.owner, unitType, next.Point, next.facing);
                        UnitCharge.Register(u, (uc: UnitCharge) => this.UnitAI(uc), next);
                        
                        RemoveGuardPosition(u);
                        SetUnitVertexColor(u, 0, 0, 0, 0);
                        SetUnitInvulnerable(u, true);

                        SetWidgetLife(u, 1);
                        SetUnitAbilityLevel(u, this.AuraDamage, level);
                        units.push(u);
                    }
                    next = next.Next();
                }
                data.units = units;

                // AddSpecialEffect(this.Sfx, GetUnitX(data.unit), GetUnitY(data.unit));
                TimerStart(data.timer, 0.1, true, () => {
                    if (data.loops > 0) {
                        data.loops--;
                        for (let unit of data.units) {
                            SetUnitVertexColor(unit, 0, 0, 0, 0 - data.loops * 25);
                        }
                    } else {
                        for (let unit of data.units) {
                            SetUnitVertexColor(unit, 0, 0, 0, 255);
                            SetUnitInvulnerable(unit, false);
                            PauseUnit(unit, false);
                        }
                        
                        PauseTimer(data.timer);
                        DestroyTimer(data.timer);
                        data = null;
                    }
                });
            });
            Interruptable.Register(caster, () => {

                if (data.done == false) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    data.done = true;
                    // IssueImmediateOrder(caster, "stop");
                }
                return false;
            });

        });

        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ATTACKED);
        TriggerAddAction(t, () => {

            let attacker = GetAttacker();
            if (GetUnitTypeId(attacker) != Units.VolatileLeeches) return;
            let owner = GetOwningPlayer(attacker);
            let bites = GetUnitAbilityLevel(attacker, this.AuraBites);
            let hp = GetWidgetLife(attacker);
            let aoe = 250;

            if (bites >= 8) {
                if (GetUnitAbilityLevel(attacker, Buffs.CorruptedBlood) > 0) {
                    // Explode for damage
                    GroupEnumUnitsInRange(SpellGroup, GetUnitX(attacker), GetUnitY(attacker), aoe, null);
                    let unitsToDamage = [];
                    let u = FirstOfGroup(SpellGroup);
                    while (u != null) {
                        GroupRemoveUnit(SpellGroup, u);
                        if (this.DamageFilter(u)) {
                            unitsToDamage.push(u);
                        }
                        u = FirstOfGroup(SpellGroup);
                    }
                    let dmg = hp / unitsToDamage.length;
                    for (let u of unitsToDamage) {
                        UnitDamageTarget(attacker, u, dmg, false, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                    }
                } else {
                    // Explode for healing
                    GroupEnumUnitsInRange(SpellGroup, GetUnitX(attacker), GetUnitY(attacker), aoe, null);
                    let unitsToHeal = [];
                    let u = FirstOfGroup(SpellGroup);
                    while (u != null) {
                        GroupRemoveUnit(SpellGroup, u);
                        if (this.HealFilter(u, owner)) {
                            unitsToHeal.push(u);
                        }
                        u = FirstOfGroup(SpellGroup);
                    }
                    let heal = hp / unitsToHeal.length;
                    for (let u of unitsToHeal) {
                        SetWidgetLife(u, GetWidgetLife(u) + heal);
                    }
                }
                DestroyEffect(AddSpecialEffect(this.ExplodeSfx, GetUnitX(attacker), GetUnitY(attacker)));
                KillUnit(attacker);
            } else {
                let scale = 0.6 + hp / 100 - hp * 0.004;
                SetUnitScale(attacker, scale, scale, scale);
                SetUnitVertexColor(attacker, math.floor(255 * 0.09 * bites), 0, 0, 255);
                SetUnitAbilityLevel(attacker, this.AuraBites, bites + 1);
            }
        });
        for (let i = 0; i < 4; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}