import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/OrbType";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Dummies, Models } from "Config";
import { UpgradeTracker } from "Modules/Globals";

export class Bless {
    public static SpellId: number;
    public static readonly DummySpellId = Dummies.Bless;
    public static readonly DummyOrder = "innerfire";
    public static readonly Sfx: string = "Radiance Holy.mdl";
    public static CastSfx = Models.CastDetermination;
    public static OrbCost: OrbType[] = [];

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.White,
            OrbType.White,
            OrbType.Red
        ];

        // UpgradeTracker.Register(requirement, this.OrbCost);
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const x = GetSpellTargetX();
            const y = GetSpellTargetY();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                aoe: 150 + 100 * level,
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "origin"),
                castTime: [ 3.0, 2.5, 2.0, 1.5 ][level - 1],
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

                GroupEnumUnitsInRange(SpellGroup, x, y, data.aoe, null);
                let u = FirstOfGroup(SpellGroup);
                while (u != null) {
                    GroupRemoveUnit(SpellGroup, u);
                    SpellHelper.DummyCastTarget(owner, x, y, u, this.DummySpellId, level, this.DummyOrder);
                    u = FirstOfGroup(SpellGroup);
                }
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