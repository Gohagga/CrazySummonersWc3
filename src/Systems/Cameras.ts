import { GamePlayer } from "./GamePlayer";

export class Cameras {
    public static TeamCameras: Record<number, string> = {
        1: "h1",
        2: "h1"
    }
    public static Setup: Record<string, camerasetup>;

    public static SetPlayerTeamCamera(player: player) {

        let team = GamePlayer.Team[GetPlayerId(player)];
        let camera = this.Setup[this.TeamCameras[team]];
        CameraSetupApplyForPlayer(true, camera, player, 0);
    }

    static init() {

        this.Setup = {
            h1: gg_cam_GameCameraH1,
            h2: gg_cam_GameCameraH2,
            red: gg_cam_GameCamera_Red,
            blue: gg_cam_GameCamera_Blue,
        }

        let t = CreateTrigger();
        for (let i = 0; i < 8; i++) {
            TriggerRegisterPlayerChatEvent(t, Player(i), "-cam", true);
        }
        TriggerAddAction(t, () => {
            let player = GetTriggerPlayer();
            Cameras.SetPlayerTeamCamera(player);
        });
    }
}