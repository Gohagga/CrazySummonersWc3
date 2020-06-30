import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units } from "Config";
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

export class IceBlast {
    public static SpellId: number;
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

            let data = {
                done: false,

                awakened: false,
                damage: 17.5 + 47.5  * level,
                aoe: 200 + 50 * level,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 2,
            }
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                if (!paid && ResourceBar.Get(owner.handle).Consume(this.OrbCost)) {
                    ElementalistMastery.Get(caster).AddExperience(this.Type, this.OrbCost.length);
                } else if (!paid) return;

                if (data.awakened) {
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
                    Chill.Apply(t, 4);
                    new Effect(this.DamageSfx, t, "origin").destroy();
                }
                AwakenEssence.ReleaseEssence(EssenceType.Frost, caster).RemoveCaster();
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    data.awakened = true;
                    return true;
                }
                
                if (!data.done) {
                    data.castSfx.destroy()
                    castBar.Destroy();
                    data.done = true;
                }
                return false;
            });
        };

        this.FreeSpellId = FourCC('A03S');
        SpellEvent.RegisterSpellCast(this.SpellId, () => actions(false));
        SpellEvent.RegisterSpellCast(this.FreeSpellId, () => actions(true));

        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
            BlzSetAbilityExtendedTooltip(this.FreeSpellId, tooltip, i);
        }
    }
}