import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units, Dummies, Tooltips } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, Effect, Point, Timer } from "w3ts/index";
import { AwakenEssence } from "./AwakenEssence";
import { SpellHelper } from "Global/SpellHelper";
import { StatWeights } from "Systems/BalanceData";
import { EssenceType } from "Classes/EssenceType";
import { ElementalistMastery } from "Classes/ElementalistMastery";
import { TextRenderer } from "Global/TextRenderer";

export class Conductivity {
    public static SpellId: number;
    public static Tooltip: string = Tooltips.Conductivity;
    public static SpawnedUnitId: number = Units.Doo;
    public static readonly DummySpellId = Dummies.Conductivity;
    public static readonly DummyOrder = "thunderbolt";
    public static readonly BuffId = Buffs.Conductivity;
    public static readonly Sfx: string = Models.IceBlast;
    public static readonly LightningSfx: string = "CLSB"; // "CLPB";
    public static readonly DamageSfx: string = "Abilities\\Spells\\Orc\\LightningBolt\\LightningBoltMissile.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];
    public static Type: EssenceType = EssenceType.Lightning;
    static FreeSpellId: number;

    private static SpawnedUnitWeights: StatWeights = {
        offenseRatio: 0.6,
        defenseRatio: 0.45,
        defense: {
            armorGrowth: 0,
            armorRatio: 0
        },
        attack: {
            speed: 1.125,
            dpsVariation: 0.35,
            targetsCount: 1,
            targetsMultiplier: 1,
            diceTweaks: [20, 20, 0.1]
        }
    };

    private static Data(context: Record<string, any>) {
        let { level, caster } = context as { level: number, caster: Unit };
        return {
            castTime: 1,
            count: math.floor((level - 1) / 3) + 1,
            maxTargets: 4 + 4 * level,
            interval: 0.2,
            damage: 5 + level,
            radius: 1200,
        };
    }
    

    private timer: Timer;
    private light: lightning;
    private originUnit: Unit;

    constructor(
        private caster: Unit,
        private maxTargets: number,
        private data: {
            interval: number,
            radius: number,
            damage: number,
        }
    ) {
        this.originUnit = caster;
        this.timer = new Timer();
    }

    private Start(target: Unit) {

        this.Jump(target);

        let interval = this.data.interval * GetRandomReal(0.85, 1.15);
        this.timer.start(interval, false, () => {
            this.Execute();
        });
    }

    private Execute() {

        if (this.maxTargets-- < 1) {
            this.Destroy();
            return;
        };
        const targets = SpellHelper.EnumUnitsInRange(this.originUnit.point, this.data.radius, (t, c) => {
            let condition = t.isAlive() &&
                t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                t.isHero() == false &&
                t.isAlly(this.caster.owner) == false &&
                t.life > 0.405 &&
                t.getAbilityLevel(Conductivity.BuffId) < 1;
                
            return condition;
        });

        // 1. Find nearby valid target
        let choices: { unit: Unit, priority: number }[] = [];
        for (let u of targets) {
            choices.push({
                unit: u,
                priority: GetRandomReal(0, 1)
            });
        }

        choices.sort((a, b) => a.priority - b.priority);
        let chosenTarget = choices.pop();
        if (!chosenTarget) {
            this.Destroy();
            return;
        }
        this.Jump(chosenTarget.unit);
        let light = this.light;
        let tim = new Timer();
        tim.start(0.3, false, () => {
            DestroyLightning(light)
            tim.destroy();
        });

        let interval = this.data.interval * GetRandomReal(0.5, 1.15);
        this.timer.start(interval, false, () => {
            this.Execute();
        });
    }

    private Jump(nextTarget: Unit) {

        // Log.info("Execute", this.maxTargets);
        // 2. Chain to them
        // DestroyLightning(this.light);
        // Create a lightning effect from current unit to target unit
        let light = AddLightningEx(Conductivity.LightningSfx, false, 
            this.originUnit.x, this.originUnit.y, this.originUnit.getflyHeight(),
            nextTarget.x, nextTarget.y, nextTarget.getflyHeight());
        
        let tim = new Timer();
        tim.start(0.6, false, () => {
            DestroyLightning(light)
            tim.destroy();
        });
        this.light = light;

        // Damage the target unit
        UnitDamageTarget(this.caster.handle, nextTarget.handle, this.data.damage, true, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, null);

        // Create special effect
        let sfx = new Effect(Conductivity.DamageSfx, nextTarget.x, nextTarget.y);
        sfx.setHeight(nextTarget.getflyHeight());
        sfx.destroy();

        // Dummy cast a stun ability on the unit
        SpellHelper.DummyCastTarget(this.caster.owner.handle, nextTarget.x, nextTarget.y, nextTarget.handle, Conductivity.DummySpellId, 1, Conductivity.DummyOrder);

        this.originUnit = nextTarget;
    }

    private Destroy() {
        this.timer.destroy();
        DestroyLightning(this.light);
        AwakenEssence.RemoveEssenceCaster(EssenceType.Lightning, this.caster);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Purple
        ];
        let actions = (paid: boolean) => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const target = Unit.fromHandle(GetSpellTargetUnit());
            let level = caster.getAbilityLevel(this.SpellId);
            if (level == 0) level = caster.getAbilityLevel(this.FreeSpellId);

            let data = this.Data({caster, level});
            let instance = {
                done: false,
                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                timer: new Timer(),
            };

            Log.info("Conductivity cast");
            
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
                        AwakenEssence.SpawnEssence(EssenceType.Lightning, this.FreeSpellId, level, caster, awaken.targetPoint);
                    }
                    return;
                } else AwakenEssence.CleanEvent(caster);
                Log.info("Effect")

                // Start the spell
                for (let i = 0; i < data.count; i++) {

                    let instance = new Conductivity(caster, data.maxTargets, {
                        damage: data.damage,
                        interval: data.interval,
                        radius: data.radius
                    });
                    instance.Start(target);
                }
                
                AwakenEssence.ReleaseEssence(EssenceType.Lightning, caster);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster)) {
                    instance.awakened = true;
                    return true;
                }
                if (!instance.done) {
                    instance.castSfx.destroy()
                    castBar.Destroy();
                    instance.done = true;
                }
                return false;
            });
        };

        this.FreeSpellId = FourCC('A03T');
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