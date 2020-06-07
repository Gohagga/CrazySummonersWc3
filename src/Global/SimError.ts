export class SimError {
    public static errorSound = CreateSoundFromLabel("InterfaceError", false, false, false, 10, 10);

    public static Msg(forPlayer: player, msg: string) {
        msg = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n|cffffcc00"+msg+"|r";

        if (GetLocalPlayer() == forPlayer) {
            ClearTextMessages();
            DisplayTimedTextToPlayer(forPlayer, 0.52, 0.9, 2, msg);
            StartSound(this.errorSound);
        }
    }

    static init() {}
}