import { SpellEvent } from "Global/SpellEvent";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbType } from "Systems/OrbResource/Orb";
import { SpellHelper, SpellGroup } from "Global/SpellHelper";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { Interruptable } from "Global/Interruptable";
import { Dummies, Models, Buffs } from "Config";

export class ContagiousInsanity {
    public static SpellId: number;
    public static DummySpellId = Dummies.ContagiousInsanity;
    public static DummyOrder = "bloodlust";
    public static readonly Sfx: string = "Abilities\\Spells\\Orc\\SpiritLink\\SpiritLinkTarget.mdl";
    public static readonly DamageSfx: string = "StormfallOrange.mdl";
    public static CastSfx = Models.CastShadow;

    private spreadRange: number;
    private spreadInterval: number;
    private repeatCount: number;
    private spreadCount: number;
    private level: number;
    private target: unit;
    private timer: timer;

    constructor(target: unit, data: { level: number, spreadRange: number, spreadInterval: number, repeatCount: number, spreadCount: number }) {
        this.spreadRange = data.spreadRange;
        this.spreadInterval = data.spreadInterval;
        this.repeatCount = data.repeatCount;
        this.spreadCount = data.spreadCount;
        this.level = data.level;
        this.target = target;
        this.timer = CreateTimer();

        SpellHelper.DummyCastTarget(Player(PLAYER_NEUTRAL_PASSIVE), GetUnitX(target), GetUnitY(target), target, ContagiousInsanity.DummySpellId, this.level, ContagiousInsanity.DummyOrder);
        if (this.repeatCount > 0) {
            TimerStart(this.timer, data.spreadInterval, true, () => {

                // If it wore off or it won't spread, stop this timer
                if (GetUnitAbilityLevel(this.target, Buffs.ContagiousInsanity) < 1 || this.repeatCount == 0) {
                    PauseTimer(this.timer);
                    DestroyTimer(this.timer);
                } else {

                    // Try to spread it to nearby units
                    GroupEnumUnitsInRange(SpellGroup, GetUnitX(this.target), GetUnitY(this.target), this.spreadRange, SpellHelper.UnitAliveFilter);
                    let u = FirstOfGroup(SpellGroup);
                    let count = this.spreadCount;
                    while (u != null && count > 0) {
                        GroupRemoveUnit(SpellGroup, u);
                        if (GetUnitAbilityLevel(u, Buffs.ContagiousInsanity) < 1) {
                            let ci = new ContagiousInsanity(u, {
                                level: this.level,
                                spreadCount: this.spreadCount,
                                repeatCount: this.repeatCount - 1,
                                spreadInterval: this.spreadInterval,
                                spreadRange: this.spreadRange
                            });
                            count--;
                        }
                        u = FirstOfGroup(SpellGroup);
                    }
                }
            });
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);
            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);

            let data = {
                range: 400,
                // targetSfx: AddSpecialEffectTarget(this.Sfx, target, "origin"),
                castSfx: AddSpecialEffectTarget(this.CastSfx, caster, "chest"),
                castTime: 2,
                spreadInterval: 1,
                spreadCount: 1 + math.floor(level * 0.5),
                repeatCount: math.floor(1.5 + level * 0.5)
            }
            
            let cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, data.castTime, () => {
                cb.Finish();
                DestroyEffect(data.castSfx);

                if (!ResourceBar.Get(owner).Consume([
                    OrbType.Blue
                ])) return;

                let ci = new ContagiousInsanity(target, {
                    level: level,
                    repeatCount: data.repeatCount,
                    spreadCount: data.spreadCount,
                    spreadInterval: data.spreadInterval,
                    spreadRange: data.range
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