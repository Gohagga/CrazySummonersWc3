import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units, Tooltips } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, Effect, Point, Timer } from "w3ts/index";
import { AwakenEssence } from "./AwakenEssence";
import { SpellHelper } from "Global/SpellHelper";
import { Chill } from "./Chill";
import { StatWeights } from "Systems/BalanceData";
import { EssenceType } from "Classes/EssenceType";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";

export class IceBlast {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.IceBlast;
    public static SpawnedUnitId: number = Units.Dabba;
    public static readonly Sfx: string = Models.IceBlast;
    public static readonly DamageSfx: string = "Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];
    public static Type: EssenceType = EssenceType.Frost;
    static FreeSpellId: number;

    private static SpawnedUnitWeights: StatWeights = {
        offenseRatio: 0.35,
        defenseRatio: 0.6,
        defense: {
            armorGrowth: 0,
            armorRatio: 0
        },
        attack: {
            speed: 1.5,
            dpsVariation: 0.14,
            targetsCount: 1,
            targetsMultiplier: 1,
            diceTweaks: [20, 20, 0.1]
        }
    };

    private static Data(context: Record<string, any>) {
        let { level } = context as { level: number };
        return {
            chill: 4,
            damage: 17.5 + 47.5  * level,
            aoe: 200 + 50 * level,
            castTime: 2,
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Blue,
            OrbType.Red
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);

            let data = this.Data({level});
            let inst = {
                done: false,
                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
            }
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                inst.castSfx.destroy();

                if (!paid && ResourceBar.Get(owner.handle).Consume(this.OrbCost)) {
                    ElementalistMastery.Get(caster).AddExperience(this.Type, this.OrbCost.length);
                } else if (!paid) return;

                if (inst.awakened) {
                    Log.info("calling awaken");
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        AwakenEssence.SpawnEssence(EssenceType.Frost, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);
                Log.info("Effect")

                let sfx = AddSpecialEffect(this.Sfx, x, y);
                BlzSetSpecialEffectScale(sfx, data.aoe * 0.008);
                BlzSetSpecialEffectOrientation(sfx, GetRandomReal(0, 3.14), 0, 0);
                DestroyEffect(sfx);

                let targets = SpellHelper.EnumUnitsInRange(new Point(x, y), data.aoe, (u) => 
                    u.isAlive() &&
                    u.isHero() == false &&
                    u.isAlly(owner) == false);

                for (let t of targets) {
                    UnitDamageTarget(caster.handle, t.handle, data.damage, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
                    Chill.Apply(t, data.chill);
                    new Effect(this.DamageSfx, t, "origin").destroy();
                }
                AwakenEssence.ReleaseEssence(EssenceType.Frost, caster).RemoveCaster();
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    inst.awakened = true;
                    return true;
                }
                
                if (!inst.done) {
                    inst.castSfx.destroy()
                    castBar.Destroy();
                    inst.done = true;
                }
                return false;
            });
        };

        this.FreeSpellId = FourCC('A03S');
        SpellEvent.RegisterSpellCast(this.SpellId, () => actions(false));
        SpellEvent.RegisterSpellCast(this.FreeSpellId, () => actions(true));

        for (let i = 0; i < 7; i++) {
            let data = this.Data({ level: i+1 }) as Record<string, any>;
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + TextRenderer.Render(this.Tooltip, data);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
            BlzSetAbilityExtendedTooltip(this.FreeSpellId, tooltip, i);
        }
    }
}