import { Unit, MapPlayer } from "w3ts/index";

export class GamePlayer {
    public static SpawnPoint: Record<number, location> = {};
    public static Hero: Record<number, unit> = {};
    public static HeroSelect: Record<number, unit> = {};
    public static Shop: Record<number, Unit> = {};
    public static Team: Record<number, number> = {
        0: 1,
        2: 1,
        3: 1,
        5: 1,

        1: 2,
        4: 2,
        6: 2,
        9: 2
    };

    public static TeamArmy: Record<number, MapPlayer> = {
        0: MapPlayer.fromIndex(5),
        1: MapPlayer.fromIndex(9),
    }

    static init() {}
}