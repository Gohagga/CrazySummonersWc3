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

export class IceBlast {
    public static SpellId: number;
    public static readonly Sfx: string = Models.IceBlast;
    public static readonly DamageSfx: string = "Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl";
    public static CastSfx = Models.CastNecromancy;
    public static AwakenOrder: number;
    public static OrbCost: OrbType[] = [];

    static init(spellId: number) {
        this.SpellId = spellId;
        this.AwakenOrder = String2OrderIdBJ(Orders.AwakenEssence);
        this.OrbCost = [
            OrbType.Blue,
            OrbType.Purple
        ];
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = Unit.fromEvent();
            const owner = caster.owner;
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = caster.getAbilityLevel(this.SpellId);

            let data = {
                done: false,

                awakened: false,
                damage: 60 + 40 * level,
                aoe: 200 + 50 * level,
                castSfx: new Effect(this.CastSfx, caster, "origin"),
                castTime: 2,
            }
            Log.info("Ice Blast cast");
            
            let castBar = new CastBar(caster.handle);
            castBar.CastSpell(this.SpellId, data.castTime, () => {
                castBar.Finish();
                data.castSfx.destroy();

                if (!ResourceBar.Get(owner.handle).Consume(this.OrbCost)) return;

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
                    new Effect(this.DamageSfx, t, "origin").destroy();
                }

                Log.info("Has been awakened:", data.awakened);
            });
            Interruptable.Register(caster.handle, (orderId) => {

                Log.info("interrupted", orderId, this.AwakenOrder);
                if (orderId == this.AwakenOrder) {
                    let x = GetOrderPointX();
                    let y = GetOrderPointY();
                    if ((x - caster.x)*(x - caster.x) + (y - caster.y)*(y - caster.y) < AwakenEssence.Range * AwakenEssence.Range) {
                        data.awakened = true;
                        return true;
                    }
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