import { Auras, Buffs, Models, SpawnedUnitTypes, Spells } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup } from "Global/SpellHelper";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";

export class ArmyOfTheDead {
    public static SpellId: number;
    public static BuffId: number = Buffs.ArmyOfTheDead;
    public static AuraBuff = Auras.ArmyOfTheDead;
    private static SpawnedType = SpawnedUnitTypes.Undead.slice(0, 10);
    public static readonly Sfx: string = "Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];

    public static Filter(target: unit) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) && 
            (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false) &&
            (GetWidgetLife(target) <= 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Blue,
            OrbType.Purple,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let might = math.fmod((level-1), 4);
            let will = math.floor((level-1) / 4);

            let data = {
                done: false,

                aoe: 250 + 50 * will,
                duration: 8 + will * 2,
                summonLevel: GetUnitAbilityLevel(caster, Spells.SummonGhoul) + might,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: 3,
            }
            if (data.summonLevel < 1) data.summonLevel = 1;
            if (data.summonLevel > 10) data.summonLevel = 10;
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    if (this.Filter(u)) {
                        let pos = GetUnitLoc(u);
                        let facing = GetUnitFacing(u);

                        let rep = CreateUnitAtLoc(owner, this.SpawnedType[data.summonLevel - 1], pos, facing);
                        UnitApplyTimedLife(rep, this.BuffId, data.duration);
                        SetUnitVertexColor(rep, 120, 35, 35, 255);
                        UnitAddAbility(rep, Auras.LanePersistance);
                        UnitAddAbility(u, this.AuraBuff);
                        SetUnitExploded(rep, true);
                        // DestroyEffect(AddSpecialEffectTarget(this.Sfx, u, "origin"));
                    }
                    u = FirstOfGroup(SpellGroup);
                }
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