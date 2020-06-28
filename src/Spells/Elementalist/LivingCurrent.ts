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

export class LivingCurrent {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.LivingCurrentLightning;
    public static readonly DummyOrder = "forkedlightning";
    public static readonly DummyBuffSpellId = Dummies.LivingCurrent;
    public static readonly DummyBuffOrder = "unholyfrenzy";
    public static readonly BuffId = Buffs.LivingCurrent;

    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];

    private static readonly Period = 0.2;

    private buffer = 0;
    constructor(
        private caster: Unit,
        private unit: Unit,
        private duration: number,
        private interval: number,
        private range: number,
        private level = 1,
        private timer = new Timer()
    ) {
        this.Execute();
    }

    private Execute() {

        // Condition to destroy
        if (this.unit.handle == null ||
            this.unit.life <= 0.405 ||
            this.duration <= 0
        ) {
            this.Destroy();
        }

        // Try to unleash a bolt
        if (this.buffer >= this.interval) {
            
            // Log.info("unleashing");
            if (this.UnleashLightning())
                this.buffer -= this.interval + GetRandomReal(-0.25, 0.25);
        }

        this.buffer += LivingCurrent.Period;
        this.duration -= LivingCurrent.Period;
        // restart the timer
        this.timer.pause();
        this.timer.start(LivingCurrent.Period, false, () => this.Execute());
    }

    private UnleashLightning() {

        let owner = this.caster.owner;
        const targets = SpellHelper.EnumUnitsInRange(this.unit.point, this.range, (t) =>
            t.isEnemy(owner) &&
            t.isHero() == false &&
            t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
            t.life > 0.405);

        if (targets.length == 0) return false;

        let sorted = SpellHelper.SortUnitsByValue(targets, () => GetRandomReal(0, 1));
        let chosen = sorted.pop();
        SpellHelper.DummyCastTarget(owner.handle, chosen.unit.x, chosen.unit.y, chosen.unit.handle,
            LivingCurrent.DummySpellId, this.level, LivingCurrent.DummyOrder);
        return true;
    }
    
    private Destroy() {
        this.timer.destroy();
        this.unit.removeAbility(LivingCurrent.BuffId);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
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
                castTime: 1.5,

                interval: 2.6 - 0.14 * level,
                range: 250 + 50 * level,
                duration: 7 + level,
                // damage: is handled in the dummy ability
            }
            Log.info("Living Current cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

                Log.info("Effect")

                SpellHelper.DummyCastTarget(owner.handle, target.x, target.y, target.handle, this.DummyBuffSpellId,
                    level, this.DummyBuffOrder);

                // Start the spell
                let instance = new LivingCurrent(caster, target, data.duration,
                    data.interval, data.range, level);
                
                Log.info("Has been awakened:", data.awakened);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                if (AwakenEssence.Check(orderId, caster, GetOrderPointX(), GetOrderPointY())) {
                    data.awakened = true;
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