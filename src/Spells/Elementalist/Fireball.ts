import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, Effect, Point, Timer, Widget } from "w3ts/index";
import { AwakenEssence, EssenceType } from "./AwakenEssence";
import { SpellHelper } from "Global/SpellHelper";
import { GamePlayer } from "Systems/GamePlayer";
import { Chill } from "./Chill";
import { SpawnPoint } from "Spells/Spawn";
import { StatWeights } from "Systems/BalanceData";

export class Fireball {
    public static SpellId: number;
    public static SpawnedUnitId: number = Units.Inkie;
    public static readonly Sfx: string = Models.Fireball;
    public static readonly AoeSfx: string = Models.FireExplosion;
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];
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

            let data = {
                done: false,

                awakened: false,
                damage: 100.0 + 60 * (level-1),
                radius: 60,
                speed: 40,
                maxDistance: 1000 + 200 * level,
                aoe: 180.0 + 40.0 * level,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 2,
                trigger: CreateTrigger(),
                timer: new Timer(),
            }
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                if (!(paid || ResourceBar.Get(owner.handle).Consume(this.OrbCost))) return;

                if (data.awakened) {
                    Log.info("calling awaken");
                    let awaken = AwakenEssence.GetEvent(caster);
                    if (awaken.targetUnit) {
                        AwakenEssence.SpawnUnit(awaken.targetUnit, this.SpawnedUnitId, level, this.SpawnedUnitWeights, caster);
                    } else {
                        AwakenEssence.SpawnEssence(EssenceType.Fire, this.FreeSpellId, level, caster, awaken.targetPoint);
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

                    data.timer.destroy();
                    RemoveUnit(dummy.handle);
                    DestroyEffect(sfx);
                    let blast = AddSpecialEffect(this.AoeSfx, dummy.point.x, dummy.point.y);
                    BlzSetSpecialEffectScale(blast, data.aoe * 0.008);
                    AwakenEssence.RemoveEssenceCaster(EssenceType.Fire, caster);
                };

                let distance = data.maxDistance;
                data.timer.start(0.03, true, () => {
                    dummy.x += dx;
                    dummy.y += dy;
                    BlzSetSpecialEffectPosition(sfx, dummy.x, dummy.y, 60);
                    distance -= data.speed;
                    if (distance < 0) {
                        explode();
                    }
                });
                // Launch a projectile and explode it on hit
                TriggerRegisterUnitInRange(data.trigger, dummy.handle, data.radius, null);
                TriggerAddAction(data.trigger, () => {
                    let u = Unit.fromEvent();
                    if (u.owner != GamePlayer.TeamArmy[GamePlayer.Team[owner.id]]) return;

                    explode();
                });
                AwakenEssence.ReleaseEssence(EssenceType.Fire, caster);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    data.awakened = true;
                    return true;
                }
                if (!data.done) {
                    data.castSfx.destroy()
                    castBar.Destroy();
                    AwakenEssence.CleanEvent(caster);
                    data.done = true;
                }
                return false;
            });
        };
        this.FreeSpellId = FourCC('A03U');
        SpellEvent.RegisterSpellCast(this.SpellId, () => actions(false));
        SpellEvent.RegisterSpellCast(this.FreeSpellId, () => actions(true));

        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
            BlzSetAbilityExtendedTooltip(this.FreeSpellId, tooltip, i);
        }
    }
}