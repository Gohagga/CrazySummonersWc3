import { Auras, Buffs, Dummies, Models } from "Config";
import { Interruptable } from "Global/Interruptable";
import { CastBar } from "Global/ProgressBars";
import { SpellEvent } from "Global/SpellEvent";
import { SpellGroup, SpellHelper } from "Global/SpellHelper";
import { UnitTypeFlags } from "Global/UnitTypeFlags";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Log } from "Bootstrapper";
import { Point, MapPlayer, Unit } from "w3ts/index";

export class DeathVolley {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.DeathVolley;
    public static readonly DummyOrder = "shadowstrike";
    public static readonly Aura = Auras.AmzSpellImmunity;
    public static readonly BuffId = Buffs.AntimagicZone;
    public static readonly Sfx: string = "Abilities\\Spells\\Other\\HowlOfTerror\\HowlCaster.mdl";
    public static CastSfx = Models.CastUnholy;
    public static OrbCost: OrbType[] = [];

    public static Filter(target: unit) {
        return (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) && 
                (IsUnitType(target, UNIT_TYPE_HERO) == false) &&
                (GetWidgetLife(target) > 0.405);
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Red,
            OrbType.Red,
            OrbType.Purple,
            OrbType.Blue,
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            let data = {
                done: false,

                aoe: 350 + 100 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster.handle, "origin"),
                targetCount: 2 + level,
                castTime: 2,
            }
            
            let cb = new CastBar(caster.handle);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

                Log.info("Death Volley");

                const units = SpellHelper.EnumUnitsInRange(new Point(x, y), data.aoe, (target, caster) => {
                    let isUndead = UnitTypeFlags.IsUnitUndead(target.handle);
                    return  target.isUnitType(UNIT_TYPE_STRUCTURE) == false && 
                            target.isUnitType(UNIT_TYPE_HERO) == false &&
                            target.life > 0.405 && (
                                isUndead == false && target.isAlly(owner) == false
                                || isUndead && target.isAlly(owner) && target.life < target.maxLife);
                });
                Log.info("Unit count", units.length);

                let choice: { unit: Unit, priority: number }[] = [];
                for (let u of units) {
                    choice.push({
                        unit: u,
                        priority: GetRandomReal(0, 1)
                    });
                }
                choice.sort((a, b) => a.priority - b.priority);
                choice = choice.slice(0, data.targetCount);
                Log.info("Target count", choice.length);

                for (let c of choice) {
                    if (UnitTypeFlags.IsUnitUndead(c.unit.handle)) {
                        if (c.unit.getAbilityLevel(Buffs.CorruptedBlood) > 0) {
                            SpellHelper.DummyCastTarget(owner.handle, caster.x, caster.y, c.unit.handle, this.DummySpellId, 5, this.DummyOrder);
                        } else {
                            SpellHelper.DummyCastTarget(owner.handle, caster.x, caster.y, c.unit.handle, this.DummySpellId, level + 5, this.DummyOrder);
                        }
                    } else {
                        SpellHelper.DummyCastTarget(owner.handle, caster.x, caster.y, c.unit.handle, this.DummySpellId, level, this.DummyOrder);
                    }
                }
            });
            Interruptable.Register(caster.handle, () => {

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