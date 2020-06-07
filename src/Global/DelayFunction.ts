export class DelayFunction {
    private func: () => void;
    private next?: DelayFunction;
    private delay: number;

    constructor(delay: number, func: () => void) {
        this.func = () => func();
        this.delay = delay;
    }

    public Run() {
        let tim = CreateTimer();
        TimerStart(tim, this.delay, false, () => {
            PauseTimer(tim);
            DestroyTimer(tim);

            this.func();
            if (this.next) {
                this.next.Run();
            }
        });
        return this;
    }

    public Then(delay: number, func: () => void) {
        this.next = new DelayFunction(delay, func);// DelayFunction.SmoothRun(func, delay);
        return this.next;
    }

    public static SmoothRun(delay: number, func: () => void) {
        return new DelayFunction(delay, func).Run();
    }
}