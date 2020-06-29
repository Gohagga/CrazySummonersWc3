import { SpellEvent } from "Global/SpellEvent";
import { SpawnPoint } from "Spells/Spawn";
import { UnitCharge } from "Systems/UnitCharge";
import { ResourceBar } from "Systems/OrbResource/ResourceBar";
import { OrbCostToString } from "Systems/OrbResource/Orb";
import { Units, Log } from "Config";
import { OrbType } from "Systems/OrbResource/OrbType";
import { Unit } from "w3ts/index";
import { Balance } from "Modules/Globals";

export class SummonSeedling {
    public static SpellId: number;
    public static Sfx: string;
    private static SpawnedType = Units.Seedling;
    public static OrbCost: OrbType[] = [];

    static UnitAI(data: UnitCharge) {
        if (GetUnitCurrentOrder(data.unit) == 0) {
            let x = GetLocationX(data.destination);
            let y = GetLocationY(data.destination);
            IssuePointOrderLoc(data.unit, "attack", data.destination);
        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.OrbCost = [
            OrbType.Summoning
        ];
        SpellEvent.RegisterSpellEffect(this.SpellId, () => {
            const caster = GetTriggerUnit();
            const owner = GetOwningPlayer(caster);

            if (!ResourceBar.Get(owner).Consume(this.OrbCost)) return;

            const target = GetSpellTargetUnit();
            let level = GetUnitAbilityLevel(caster, this.SpellId);
            let sp = SpawnPoint.FromTarget(target);
            let unitType = this.SpawnedType;
            if (!sp) return;

            let data: any = {
                loops: 10,
                spawnPoint: sp,
                unitType: unitType,
                timer: CreateTimer(),
                unit: CreateUnitAtLoc(sp.owner, unitType, sp.Point, sp.facing)
            };
            this.ApplyStats(data.unit, level);
            
            UnitCharge.Register(data.unit, (uc: UnitCharge) => this.UnitAI(uc), sp);

            RemoveGuardPosition(data.unit);
            SetUnitVertexColor(data.unit, 255, 255, 255, 0);
            SetUnitInvulnerable(data.unit, true);

            TimerStart(data.timer, 0.1, true, () => {
                if (data.loops > 0) {
                    data.loops--;
                    SetUnitVertexColor(data.unit, 255, 255, 255, 255 - data.loops * 25);
                } else {
                    SetUnitVertexColor(data.unit, 255, 255, 255, 255);
                    PauseTimer(data.timer);
                    DestroyTimer(data.timer);
                    PauseUnit(data.unit, false);
                    SetUnitInvulnerable(data.unit, false);
                    data = null;
                }
            });
        });
        for (let i = 0; i < 10; i++) {
            let tooltip = OrbCostToString(this.OrbCost) + "|n|n" + BlzGetAbilityExtendedTooltip(this.SpellId, i);
            BlzSetAbilityExtendedTooltip(this.SpellId, tooltip, i);
        }
    }

    // static armor: Record<number, number> = {
    //     1: 4,
    //     2: 5,
    //     3: 5,
    //     4: 5,
    //     5: 6,
    //     6: 6,
    //     7: 7,
    //     8: 7,
    //     9: 8,
    //     10: 8,
    //     11: 8,
    //     12: 9,
    //     13: 9,
    //     14: 10,
    //     15: 10,
    // };

    // static health: Record<number, number> = {
    //     1: 141,
    //     2: 256,
    //     3: 377,
    //     4: 498,
    //     5: 592,
    //     6: 708,
    //     7: 789,
    //     8: 900,
    //     9: 970,
    //     10: 1076,
    //     11: 1182,
    //     12: 1239,
    //     13: 1341,
    //     14: 1389,
    //     15: 1488,
    // }



    static ApplyStats(unit: unit, level: number) {
        Log.info("Applying stats");
        let u = Unit.fromHandle(unit);

        Log.info("Calculating");
        let stats = Balance.Calculate(level, {
            offenseRatio: 0.5,
            defenseRatio: 0.7,
            defense: {
                armorGrowth: 0.02,
                armorRatio: 0.2
            }});
            // {
            //     diceTweaks: [0, 0, 0],
            //     dpsVariation: 0,
            //     speed: 1.5,
            //     targetsCount: 1,
            //     targetsMultiplier: 1
            // }

        // Log.info("stats:", stats.armor, stats.hitPoints, stats.baseDamage, stats.diceCount, stats.diceMaxRoll);
        u.maxLife = stats.hitPoints;
        u.life = stats.hitPoints;
        BlzSetUnitArmor(unit, stats.armor);
        u.name = `${u.name} ${level}`;
    }
}