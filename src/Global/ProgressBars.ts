export class ProgressBar {
    private static readonly Model: string = "Progressbar_01.mdl";
    private static readonly UpdatePeriod: number = 0.03;
    private static readonly Size = 2.5;
    protected done: boolean = true;
    protected unit: unit;
    protected curValue: number = 0;
    protected endValue: number = 0;
    protected speed: number = 0;
    protected reverse: boolean = false;
    protected timer = CreateTimer();
    protected timer2 = CreateTimer();
    protected onDone: () => void = () => null;
    protected z: number = 250;
    protected sfx: effect;

    constructor(unit: unit) {
        this.unit = unit;
        this.sfx = AddSpecialEffect(ProgressBar.Model, GetUnitX(unit), GetUnitY(unit));

        BlzSetSpecialEffectScale(this.sfx, ProgressBar.Size);
        BlzSetSpecialEffectTime(this.sfx, 1.0);
        BlzSetSpecialEffectTimeScale(this.sfx, 0.0);
        TimerStart(this.timer, ProgressBar.UpdatePeriod, true, () => this.UpdatePosition());
        this.UpdatePosition();
    }

    private UpdatePosition() {
        BlzSetSpecialEffectPosition(this.sfx, GetUnitX(this.unit), GetUnitY(this.unit), this.z);
    }

    public SetPercentage(percent: number, speed: number, onDone: () => void) {
        this.endValue = percent;
        this.speed = speed;

        this.reverse = this.curValue > this.endValue;

        if (speed && this.done) {
            // if (!this.timer2) this.timer2 = CreateTimer();
            TimerStart(this.timer2, 0.01, true, () => this.UpdatePercentage());
        } else {
            BlzSetSpecialEffectTime(this.sfx, percent);
        }
    }

    public UpdatePercentage() {
        const tim = GetExpiredTimer();

        if (this.reverse) {

            if (this.curValue * 0.98 > this.endValue) {
                BlzSetSpecialEffectTimeScale(this.sfx, -this.speed);
                this.curValue = (this.curValue - (this.speed));
            } else if (this.curValue * 0.98 < this.endValue) {
                PauseTimer(tim);
                BlzSetSpecialEffectTimeScale(this.sfx, 0);
                this.curValue = this.endValue;
                this.done = true;

                this.onDone();
            }
        } else {
            if (this.curValue < this.endValue * 0.98) {
                BlzSetSpecialEffectTimeScale(this.sfx, this.speed)
                this.curValue = (this.curValue + (this.speed))
            } else if (this.curValue >= this.endValue * 0.98) {
                PauseTimer(tim);
                BlzSetSpecialEffectTimeScale(this.sfx, 0);
                this.curValue = this.endValue;
                this.done = true;

                this.onDone();
            }
        }
    }

    public Finish() {
        BlzSetSpecialEffectTimeScale(this.sfx, 3.0);
        DestroyEffect(this.sfx);
        PauseTimer(this.timer2);
        DestroyTimer(this.timer2);
    }

    public Destroy() {
        BlzSetSpecialEffectAlpha(this.sfx, 0);
        DestroyEffect(this.sfx);
        PauseTimer(this.timer2);
        DestroyTimer(this.timer2);
    }
} 

export class CastBar extends ProgressBar {
    private spellId: number = 0;
    private static instance: Record<number, number> = {};

    constructor(unit: unit) {
        super(unit);
    }

    public CastSpell(spellId: number, castTime: number, callback: () => void) {
        this.endValue = 100;
        this.speed = (1 / castTime);
        this.onDone = () => callback();
        // print("castbar");

        BlzSetSpecialEffectTime(this.sfx, 0);

        if (this.done) {
            TimerStart(this.timer2, 0.01, true, () => this.UpdatePercentage());
            if (spellId) CastBar.instance[GetHandleId(this.unit)] = spellId;

            if (castTime < 0.15) DestroyEffect(this.sfx);
        }
    }

    public static GetUnitCurrentSpellId(unit: unit): number {
        const unitId = GetHandleId(unit);
        if (unitId in CastBar.instance) {
            return CastBar.instance[unitId];
        }
        return -1;
    }

    public Finish() {
        BlzSetSpecialEffectTimeScale(this.sfx, 3.0);
        DestroyEffect(this.sfx);
        PauseTimer(this.timer2);
        DestroyTimer(this.timer2);
        if (GetHandleId(this.unit) in CastBar.instance) delete CastBar.instance[GetHandleId(this.unit)];
    }

    public Destroy() {
        BlzSetSpecialEffectAlpha(this.sfx, 0);
        DestroyEffect(this.sfx);
        PauseTimer(this.timer2);
        DestroyTimer(this.timer2);
        if (GetHandleId(this.unit) in CastBar.instance) delete CastBar.instance[GetHandleId(this.unit)];
    }
}