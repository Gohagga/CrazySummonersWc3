import { Auras, Buffs, Models, SpawnedUnitTypes, Spells, Orders, Log, Units, Dummies } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, Effect, Point, Timer } from "w3ts/index";
import { AwakenEssence } from "./AwakenEssence";
import { SpellHelper } from "Global/SpellHelper";

export class Conductivity {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Conductivity;
    public static readonly DummyOrder = "thunderbolt";
    public static readonly BuffId = Buffs.Conductivity;
    public static readonly Sfx: string = Models.IceBlast;
    public static readonly LightningSfx: string = "CLSB"; // "CLPB";
    public static readonly DamageSfx: string = "Abilities\\Spells\\Orc\\LightningBolt\\LightningBoltMissile.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];

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
                t.isHero() == false &&
                t.isAlly(this.caster.owner) == false &&
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

        Log.info("Execute", this.maxTargets);
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
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Red,
            OrbType.Purple
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const target = Unit.fromHandle(GetSpellTargetUnit());
            let level = caster.getAbilityLevel(this.SpellId);

            let data = {
                done: false,

                awakened: false,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 1,
                timer: new Timer(),
                count: math.floor(level * 0.4) + 3,
                maxTargets: 20,
                data: {
                    interval: 0.2,
                    damage: 10 + 5 * level,
                    radius: 700,
                }
            }
            Log.info("Conductivity cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

                Log.info("Effect")

                // Start the spell
                for (let i = 0; i < data.count; i++) {

                    let instance = new Conductivity(caster, data.maxTargets, data.data);
                    instance.Start(target);
                }
                
                Log.info("Has been awakened:", data.awakened);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster, GetOrderPointX(), GetOrderPointY())) {
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
        });
        for (let i = 0; i < 7; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }
}