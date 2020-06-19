import { Log } from "Config";

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

    public Calculate(level: number, offenseRatio: number, defenseRatio: number, defense: DefenseStats, attack?: AttackStats): StatsResult {
        
        let diceCount: number = 0;
        let diceMaxRoll: number = 0;
        let baseDamage: number = 0;
        
        if (attack) {
            // Calculate attack first
            // avgDps
            let avgDps = (this.minDps + (level - 1) * this.dpsPerLevel) * offenseRatio;
            Log.info("avgDps", avgDps);
            // avgDpr
            let avgDpr = avgDps * attack.speed * attack.targetsMultiplier / attack.targetsCount;
            Log.info("avgDpr", avgDpr);
            // diceCount
            diceCount = Math.round((avgDpr + attack.diceTweaks[1]) / (attack.diceTweaks[0] + avgDps * attack.diceTweaks[2]));
            Log.info("diceCount", diceCount);
            // diceMaxRoll
            diceMaxRoll = Math.round(avgDpr * attack.dpsVariation / diceCount);
            Log.info("diceMaxRoll", diceMaxRoll);
            // diceDpr
            let diceDpr = (diceMaxRoll + 1) * 0.5 * diceCount;
            Log.info("diceDpr", diceDpr);
            // baseDmg
            baseDamage = Math.round(avgDpr - diceDpr);
            Log.info("baseDamage", baseDamage);
        }

        // Calculate effective hp
        let ehp = (this.minEhp + (level - 1) * this.ehpPerLevel) * defenseRatio;
        // Log.info("ehp", ehp);

        // Calculate armor
        let armor = Math.round((defense.armorRatio + defense.armorGrowth * (level - 1)) / (0.06 * (1 - defense.armorRatio)));
        // Log.info("armor", armor);

        // absorb ratio
        let absorbRatio = (armor * 0.06) / (1 + 0.06 * armor);
        // Log.info("absorbRatio", absorbRatio);

        // Calculate health
        let hitPoints = Math.round(ehp * (1 - absorbRatio))
        // Log.info("hitPoints", hitPoints);

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