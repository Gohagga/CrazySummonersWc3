export interface IRequirement {
    
    Get(player: player): number;

    Increase(player: player, amount?: number): number;

    Decrease(player: player, amount?: number): number;

    Set(player: player, amount: number): boolean;

    Subscribe(callback: (player: player) => void): void;
}