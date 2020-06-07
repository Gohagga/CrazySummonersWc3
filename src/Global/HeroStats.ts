export class HeroStats {

    private static  _crit: Record<number, number> = {};
    private static  _critDamage: Record<number, number> = {};
    private static  _haste: Record<number, number> = {};
    private static  _mastery: Record<number, number> = {};
    private static  _healingTaken: Record<number, number> = {};
    private static  _healingDone: Record<number, number> = {};

    private static readonly defaultCrit = 0.05;
    private static readonly defaultCritDamage = 1.5;
    private static readonly defaultHaste = 1.0;
    private static readonly defaultMastery = 0;
    private static readonly defaultHealingTaken = 1.0;
    private static readonly defaultHealingDone = 1.0;

    private unitId: number;

    constructor(unit: unit) {
        this.unitId = GetHandleId(unit);
    }

    public static From(unit: unit) {
        return new HeroStats(unit);
    }

    public Crit(set?: number) {
        if (!(this.unitId in HeroStats._crit)) HeroStats._crit[this.unitId] = HeroStats.defaultCrit;
        if (set) HeroStats._crit[this.unitId] += set * 0.01
        return HeroStats._crit[this.unitId];
    }

    public CritDamage(set?: number) {
        if (!(this.unitId in HeroStats._critDamage)) HeroStats._critDamage[this.unitId] = HeroStats.defaultCritDamage;
        if (set) HeroStats._critDamage[this.unitId] += set * 0.01
        return HeroStats._critDamage[this.unitId];
    }

    public Haste(set?: number) {
        if (!(this.unitId in HeroStats._haste)) HeroStats._haste[this.unitId] = HeroStats.defaultHaste;
        if (set) HeroStats._haste[this.unitId] += set * 0.01
        return HeroStats._haste[this.unitId];
    }

    public Mastery(set?: number) {
        if (!(this.unitId in HeroStats._mastery)) HeroStats._mastery[this.unitId] = HeroStats.defaultMastery;
        if (set) HeroStats._mastery[this.unitId] += set
        return HeroStats._mastery[this.unitId];
    }

    public HealingTaken(set?: number) {
        if (!(this.unitId in HeroStats._healingTaken)) HeroStats._healingTaken[this.unitId] = HeroStats.defaultHealingTaken;
        if (set) HeroStats._healingTaken[this.unitId] += set * 0.01
        return HeroStats._healingTaken[this.unitId];
    }

    public HealingDone(set?: number) {
        if (!(this.unitId in HeroStats._healingDone)) HeroStats._healingDone[this.unitId] = HeroStats.defaultHealingDone;
        if (set) HeroStats._healingDone[this.unitId] += set * 0.01
        return HeroStats._healingDone[this.unitId];
    }

    public WithBonusCritDo(bonus: number, func: () => void) {
        this.Crit(bonus);
        func();
        this.Crit(-bonus);
    }

    public WithBonusCritDamageDo(bonus: number, func: () => void) {
        this.CritDamage(bonus);
        func();
        this.CritDamage(-bonus);
    }

    public WithBonusHasteDo(bonus: number, func: () => void) {
        this.Haste(bonus);
        func();
        this.Haste(-bonus);
    }

    public WithBonusMasteryDo(bonus: number, func: () => void) {
        this.Mastery(bonus);
        func();
        this.Mastery(-bonus);
    }

    public WithBonusHealingTakenDo(bonus: number, func: () => void) {
        this.HealingTaken(bonus);
        func();
        this.HealingTaken(-bonus);
    }

    public WithBonusHealingDoneDo(bonus: number, func: () => void) {
        this.HealingDone(bonus);
        func();
        this.HealingDone(-bonus);
    }

    public CritChance(): number {
        if (math.random() < this.Crit()) {
            return this.CritDamage();
        }
        return 1.0;
    }
}