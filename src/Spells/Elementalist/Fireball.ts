import { Log, Models, Orders, Units, Tooltips } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellHelper } from "Global/SpellHelper";
import { StatWeights } from "Systems/BalanceData";
import { GamePlayer } from "Systems/GamePlayer";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { OrbType } from "Systems/OrbResource/OrbType";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { Effect, Timer, Unit } from "w3ts/index";
import { AwakenEssence } from "./AwakenEssence";
import { Chill } from "./Chill";
import { EssenceType } from "Classes/EssenceType";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";

export class Fireball {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.Fireball;
    public static SpawnedUnitId: number = Units.Inkie;
    public static readonly Sfx: string = Models.Fireball;
    public static readonly AoeSfx: string = Models.FireExplosion;
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];
    public static Type: EssenceType = EssenceType.Fire;
    static FreeSpellId: number;
    
    private static SpawnedUnitWeights: StatWeights = {
        offenseRatio: 0.48,
        defenseRatio: 0.42,
        defense: {
            armorGrowth: 0,
            armorRatio: 0
        },
        attack: {
            speed: 1.7,
            dpsVariation: 0.14,
            targetsCount: 1,
            targetsMultiplier: 1,
            diceTweaks: [15, 15, 1]
        }
    };

    private static Data(context: Record<string, any>) {
        let { level } = context as { level: number };
        return {
            
            damage: 15 + 65 * level,
            radius: 60,
            speed: 40,
            maxDistance: 1000 + 120 * level,
            aoe: 180.0 + 35.0 * level,
            castTime: 2,
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);

        this.OrbCost = [
            OrbType.Red,
            OrbType.Red
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);

            let data = this.Data({ caster, level });
            let instance = {
                done: false,
                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                trigger: CreateTrigger(),
                timer: new Timer(),
            };
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                instance.castSfx.destroy();

                if (!paid && ResourceBar.Get(owner.handle).Consume(this.OrbCost)) {
                    ElementalistMastery.Get(caster).AddExperience(this.Type, this.OrbCost.length);
                } else if (!paid) return;

                if (instance.awakened) {
                    Log.info("calling awaken");
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        AwakenEssence.SpawnEssence(this.Type, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);
                
                Log.info("Effect")
                let angle = Atan2(y - caster.y, x - caster.x);
                let dx = Cos(angle) * data.speed;
                let dy = Sin(angle) * data.speed;

                let dummy = new Unit(owner, Units.DUMMY, caster.x, caster.y, 0);
                dummy.setflyHeight(60, 0);
                let sfx = AddSpecialEffect(this.Sfx, caster.x, caster.y);
                BlzSetSpecialEffectScale(sfx, data.aoe * 0.006);
                BlzSetSpecialEffectOrientation(sfx, angle, 0, 0);

                let explode = () => {
                    let targets = SpellHelper.EnumUnitsInRange(dummy.point, data.aoe + 150, (t, c) => 
                        t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                        t.isHero() == false &&
                        t.inRangeOfPoint(dummy.point, data.aoe) &&
                        t.life > 0.405);

                    for (let t of targets) {
                        Chill.Remove(t, 3);
                        if (t.isAlly(owner) == false)
                            UnitDamageTarget(caster.handle, t.handle, data.damage, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);
                    }

                    instance.timer.destroy();
                    RemoveUnit(dummy.handle);
                    DestroyEffect(sfx);
                    let blast = AddSpecialEffect(this.AoeSfx, dummy.point.x, dummy.point.y);
                    BlzSetSpecialEffectScale(blast, data.aoe * 0.008);
                    AwakenEssence.RemoveEssenceCaster(this.Type, caster);
                };

                let distance = data.maxDistance;
                instance.timer.start(0.03, true, () => {
                    dummy.x += dx;
                    dummy.y += dy;
                    BlzSetSpecialEffectPosition(sfx, dummy.x, dummy.y, 60);
                    distance -= data.speed;
                    if (distance < 0) {
                        explode();
                    }
                });
                // Launch a projectile and explode it on hit
                TriggerRegisterUnitInRange(instance.trigger, dummy.handle, data.radius, null);
                TriggerAddAction(instance.trigger, () => {
                    let u = Unit.fromEvent();
                    if (u.owner != GamePlayer.TeamArmy[GamePlayer.Team[owner.id]]) return;

                    explode();
                });
                AwakenEssence.ReleaseEssence(this.Type, caster);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    instance.awakened = true;
                    return true;
                }
                if (!instance.done) {
                    instance.castSfx.destroy()
                    castBar.Destroy();
                    AwakenEssence.CleanEvent(caster);
                    instance.done = true;
                }
                return false;
            });
        };
        this.FreeSpellId = FourCC('A03U');
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