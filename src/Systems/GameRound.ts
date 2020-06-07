import { GamePlayer } from "./GamePlayer";

export class GameRound {
    private static Timer = CreateTimer();
    private static ExpGain = 20;
    public static IsRunning = false;
    private static UpdateTrigger = CreateTrigger();

    public static Start() {

        if (this.IsRunning == false) {
            print("Game has started!");
            EnableTrigger(this.UpdateTrigger);
            this.IsRunning = true;
        }
    }

    public static End() {
        if (this.IsRunning) {
            print("Game has ended!");
            DisableTrigger(this.UpdateTrigger);
            this.IsRunning = false;
            this.ExpGain = 20;
        }
    }

    static init() {

        let t = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t, Player(0), "-start", true);
        TriggerAddAction(t, () => this.Start());

        t = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t, Player(0), "-end", true);
        TriggerAddAction(t, () => this.End());

        TriggerRegisterTimerEventPeriodic(this.UpdateTrigger, 2.5);
        TriggerAddAction(this.UpdateTrigger, () => {
            let exp = math.floor(this.ExpGain + 0.5);
            for (let i = 0; i < 8; i++) {
                if (GamePlayer.Hero[i]) {
                    AddHeroXP(GamePlayer.Hero[i], exp, true);
                }
            }
            this.ExpGain =  this.ExpGain * 1.01;
        });
        DisableTrigger(this.UpdateTrigger);
    }
}