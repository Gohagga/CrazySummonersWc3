import { HeroController } from "AI/HeroController";
import { Unit } from "w3ts/index";
import { SpawnPoint } from "Spells/Spawn";
import { OrbType } from "Systems/OrbResource/Orb";
import { Log, Spells } from "Config";
import { GamePlayer } from "Systems/GamePlayer";

export class PaladinController extends HeroController {
    
    Main(unit: Unit): void {
        
        Log.info("Started Paladin AI");

        let lvl = unit.level;
        unit.selectSkill(Spells.SummonRanged);

        while (unit.isAlive()) {

            // If need to lvl up, learn something
            Log.info("lvl: ", lvl, unit.level);
            if (lvl < unit.level) {
                if (unit.owner.getState(PLAYER_STATE_RESOURCE_LUMBER) >= 2) {
                    IssueNeutralImmediateOrderById(unit.owner.handle, this.shop.handle, FourCC('IB0S'));
                }
                if (unit.skillPoints > 0) {
                    // Select hero skill on priority
                    this.LearnSkills(unit);
                }
                if (this.resourceBar.Count(OrbType.Summoning) == this.resourceBar.CountAvailable(OrbType.Summoning)) {
                    lvl = unit.level;
                }
            } else {
                Log.info("tick");
                let rnd = GetRandomInt(0, 4);
                // let currentSumm = this.resourceBar.CountAvailable(OrbType.Summoning);
                // let totalSumm = this.resourceBar.Count(OrbType.Summoning);
                
                this.SpawnMeleeAtRow(rnd, 1);
            }
            coroutine.yield();
        }
        // this.UntilLevel(3, () => {
        //     this.SpawnMeleeAtRow(1);
        // });
        // this.UntilLevel(4, () => {
        //     this.SpawnMeleeAtRow(2);
        // });
        // this.UntilLevel(5, () => {
        //     this.SpawnMeleeAtRow(3);
        // });
        // this.UntilLevel(6, () => {
        //     this.SpawnMeleeAtRow(4);
        // });
        // this.UntilLevel(7, () => {
        //     this.SpawnMeleeAtRow(0);
        // });
        // this.UntilLevel(8, () => {
        //     this.SpawnMeleeAtRow(1);
        // });
        // this.UntilLevel(9, () => {
        //     this.SpawnMeleeAtRow(2);
        // });
        // this.UntilLevel(10, () => {
        //     this.SpawnMeleeAtRow(3);
        // });
        // this.UntilLevel(11, () => {
        //     this.SpawnMeleeAtRow(4);
        // });
        // this.UntilLevel(12, () => {
        //     this.SpawnMeleeAtRow(0);
        // });
        // this.UntilLevel(13, () => {
        //     this.SpawnMeleeAtRow(1);
        // });
        // this.UntilLevel(14, () => {
        //     this.SpawnMeleeAtRow(2);
        // });
        // this.UntilLevel(15, () => {
        //     this.SpawnMeleeAtRow(3);
        // });
        // this.UntilLevel(16, () => {
        //     this.SpawnMeleeAtRow(4);
        // });
        // this.UntilLevel(17, () => {
        //     this.SpawnMeleeAtRow(0);
        // });
        // this.UntilLevel(18, () => {
        //     this.SpawnMeleeAtRow(1);
        // });
        // this.UntilLevel(19, () => {
        //     this.SpawnMeleeAtRow(2);
        // });
        // this.UntilLevel(20, () => {
        //     this.SpawnMeleeAtRow(3);
        // });
        // this.UntilLevel(21, () => {
        //     this.SpawnMeleeAtRow(4);
        // });
    }

    SpawnMeleeAtRow(row: number, count: number) {

        Log.info("tick tick");
        let summonCount = this.resourceBar.CountAvailable(OrbType.Summoning);
        Log.info("summon:", summonCount);
        if (summonCount < count) return;

        Log.info("continue")
        let target = this.crystals[row];


        // 3,       4,      5,      6
        // 1.5,     2,      2       3
        let totalOrbs = this.resourceBar.Count(OrbType.Summoning);
        let ranged = false;

        this.interval = 0.6;
        while ((summonCount = this.resourceBar.CountAvailable(OrbType.Summoning)) > 0) {
            if (summonCount / totalOrbs < 0.5 && this.unit.getAbilityLevel(Spells.SummonRanged) > 0) {

                if (ranged == false) {
                    ranged = true;
                    this.interval = 4;
                    coroutine.yield();
                }

                this.unit.issueTargetOrder("acolyteharvest", target);
                this.interval = 0.6;
            } else {
                this.unit.issueTargetOrder("acidbomb", target);
            }
            coroutine.yield();
        };
    }

    LearnSkills(unit: Unit) {

        this.MaxSkill(unit, Spells.SummonMelee);
        this.MaxSkill(unit, Spells.SummonRanged);
    }

    MaxSkill(unit: Unit, skill: number) {
        let lvl: number = unit.getAbilityLevel(skill);
        unit.selectSkill(skill);
        if (unit.getAbilityLevel(skill) > lvl) {
            this.MaxSkill(unit, skill);
        }
    }
}