export class BalanceData {

    private minEhp: number
    private minDps: number;

    private ehpPerLevel: number;
    private dpsPerLevel: number;

    constructor(
        private maxLevel: number,
        private secondsToDie: number,
        private maxToMinRelativeValue: number,
        minEffectiveHp: number,
        maxEffectiveHp: number
    ) {
        this.minEhp = minEffectiveHp;
        this.minDps = minEffectiveHp / secondsToDie;

        let hpDiff = maxEffectiveHp - minEffectiveHp;

        this.ehpPerLevel = hpDiff / maxLevel;
        this.dpsPerLevel = hpDiff / secondsToDie / maxLevel;
    }

    public Calculate(level: number, offenseRatio: number, defenseRatio: number, attack: AttackStats, defense: DefenseStats): StatsResult {

        // Calculate attack first
        // avgDps
        let avgDps = (this.minDps + (level - 1) * this.dpsPerLevel) * offenseRatio;
        // avgDpr
        let avgDpr = avgDps * attack.speed * attack.targetsMultiplier / attack.targetsCount;
        // diceCount
        let diceCount = Math.round((avgDpr + attack.diceTweaks[1]) / (attack.diceTweaks[0] + avgDps * attack.diceTweaks[2]));
        // diceMaxRoll
        let diceMaxRoll = Math.round(avgDpr * attack.dpsVariation / diceCount);
        // diceDpr
        let diceDpr = (diceMaxRoll + 1) * 0.5 * diceCount;
        // baseDmg
        let baseDamage = avgDpr - diceDpr;

        // Calculate effective hp
        let ehp = (this.minEhp + (level - 1) * this.ehpPerLevel) * defenseRatio;

        // Calculate armor
        let armor = Math.round((defense.armorRatio + defense.armorGrowth * (level - 1)) / (0.06 * (1 - defense.armorRatio)));

        // absorb ratio
        let absorbRatio = (armor * 0.06) / (1 + 0.06 * armor);

        // Calculate health
        let hitPoints = ehp * (1 - absorbRatio)

        return {
            baseDamage,
            diceCount,
            diceMaxRoll,
            hitPoints,
            armor
        }
    }
}

export type StatsResult = {
    baseDamage: number,
    diceCount: number,
    diceMaxRoll: number,
    hitPoints: number,
    armor: number,
}

export type AttackStats = {
    targetsMultiplier: number,
    targetsCount: number,
    speed: number,
    diceTweaks: number[],
    dpsVariation: number
}

export type DefenseStats = {
    armorRatio: number,
    armorGrowth: number,
}