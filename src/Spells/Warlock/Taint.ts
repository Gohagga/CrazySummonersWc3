import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Dummies, Auras, Models, Buffs } from "Config";

export class Taint {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Taint;
    public static readonly DummyOrder = "unholyfrenzy";
    public static readonly Aura1 = Auras.Taint1;
    public static readonly Aura2 = Auras.Taint2;
    public static readonly Sfx: string = "Call of Dread Purple.mdl";
    public static CastSfx = Models.CastSacrifice;
    public static readonly Fps = 4;
    public static readonly Period = 1;

    private caster: unit;
    private targets: unit[];
    private damageMultiplier: number;
    private timer = CreateTimer();

    constructor(caster: unit, targets: unit[], dmgMul: number) {
        this.caster = caster;
        this.targets = targets;
        this.damageMultiplier = dmgMul;

        for (let u of targets) {
            if (GetUnitAbilityLevel(u, Buffs.Taint)) {
                UnitAddAbility(u, Taint.Aura1);
                UnitAddAbility(u, Taint.Aura2);
            }
        }
    }

    public static UpdateDamageBonus(data: Taint) {

        if (data.targets.length == 0) return false;

        let updatedTargets: unit[] = [];

        for (let u of data.targets) {
            if (GetUnitAbilityLevel(u, Buffs.Taint) < 1) {
                UnitRemoveAbility(u, this.Aura1);
                UnitRemoveAbility(u, this.Aura2);
            } else {
                updatedTargets.push(u);
                let missingLifePercent = 1 - GetWidgetLife(u) / GetUnitState(u, UNIT_STATE_MAX_LIFE);
                let damageBonus = data.damageMultiplier * missingLifePercent;
                let halfDamageBonus = math.floor(damageBonus + 0.5) + 1;
                SetUnitAbilityLevel(u, this.Aura1, halfDamageBonus);
                SetUnitAbilityLevel(u, this.Aura2, halfDamageBonus);
            }
        }
        return true;
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);            
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let castTime = 3.4 - 0.4 * level;

            let data = {
                caster: caster,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                aoe: 150 + 100 * level,
                damageMultiplier: 12.5 + 12.5 * level,
                castTime: [ 3.0, 2.5, 2.0, 1.5 ][level - 1],
                targets: []
            }
            // BlzSetSpecialEffectScale(data.castSfx, 2.2);
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Purple,
                    OrbType.Red
                ])) return;

                let sfx = AddSpecialEffect(this.Sfx, x, y);
                BlzSetSpecialEffectScale(sfx, 0.0045 * data.aoe);
                DestroyEffect(sfx);


                let targets = SpellHelper.TableEnumUnitsInRange(x, y, data.aoe, SpellHelper.UnitAliveFilter);
                for (let u of targets) {
                    SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
                }

                let taint = new Taint(caster, targets, data.damageMultiplier);
                TimerStart(taint.timer, this.Period, true, () => {
                    if (this.UpdateDamageBonus(taint) == false) {
                        PauseTimer(taint.timer);
                        DestroyTimer(taint.timer);
                    }
                });

                IssueImmediateOrder(caster, "spell");
            });
            Interruptable.Register(caster, () => {

                if (data) {
                    DestroyEffect(data.castSfx);
                    cb.Destroy();
                    IssueImmediateOrder(caster, "stop");
                }
                return false;
            });
        });
    }
}