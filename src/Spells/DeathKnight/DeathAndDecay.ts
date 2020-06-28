import { Dummies, Models, Units } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup, SpellHelper } from "Global/SpellHelper";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit, MapPlayer, Timer, Point, Effect } from "w3ts/index";

export class DeathAndDecay {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.DeathAndDecay;
    public static readonly DummyOrder = "deathanddecay";
    public static readonly HealSfx: string = "Abilities\\Weapons\\SorceressMissile\\SorceressMissile.mdl";
    public static readonly DamageSfx: string = "Abilities\\Spells\\Undead\\DeathandDecay\\DeathandDecayDamage.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static OrbCost: OrbType[] = [];

    private static readonly Period = 1.5;

    private dummyCaster: Unit;
    private timer = new Timer();

    constructor(
        private damage: number,
        private healing: number,
        private owner: MapPlayer,
        private radius: number,
        private center: Point,
        private duration: number,
        level: number,
    ) {
        this.dummyCaster = new Unit(owner, Units.DUMMY, 0, 0, 0);
        this.dummyCaster.addAbility(DeathAndDecay.DummySpellId);
        this.dummyCaster.setAbilityLevel(DeathAndDecay.DummySpellId, level);
        this.dummyCaster.issueOrderAt(DeathAndDecay.DummyOrder, center.x, center.y);
        this.dummyCaster.applyTimedLife(FourCC('B000'), duration);
    }

    public Run() {
        this.timer.start(DeathAndDecay.Period, true, () => {
            
            let targets = SpellHelper.EnumUnitsInRange(this.center, this.radius, (t) =>
                t.isUnitType(UNIT_TYPE_STRUCTURE) == false &&
                t.isUnitType(UNIT_TYPE_MECHANICAL) == false &&
                t.isHero() == false &&
                t.life > 0.405);
            
            for (let t of targets) {
                let isUndead = UnitTypeFlags.IsUnitUndead(t.handle);
                let maxHp = t.maxLife;

                if (isUndead == false) {
                    UnitDamageTarget(this.dummyCaster.handle, t.handle, maxHp * this.damage, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
                    new Effect(DeathAndDecay.DamageSfx, t, "origin").destroy();
                } else {
                    t.life += this.healing * maxHp;
                    new Effect(DeathAndDecay.HealSfx, t, "origin");
                }
            }

            this.duration -= DeathAndDecay.Period;
            if (this.duration <= 0) this.End();
        });
    }

    public End() {
        this.timer.pause();
        this.timer.destroy();
        RemoveUnit(this.dummyCaster.handle);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Purple,
            OrbType.Blue,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const point = Point.fromHandle(GetSpellTargetLoc());
            let level = caster.getAbilityLevel(this.SpellId);

            let data = {
                done: false,

                aoe: 200 + 100 * level,
                damage: 0.05,
                healing: 0.02,
                duration: 12 + 3 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster.handle, "origin"),
                castTime: 3.5,
            };
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

                let amz = new DeathAndDecay(data.damage, data.healing, owner, data.aoe, point, data.duration, level);
                amz.Run();
            });
            Interruptable.Register(caster.handle, (orderId: number) => {

                if (data.done == false) {
                    DestroyEffect(data.castSfx);
                    castBar.Destroy();
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