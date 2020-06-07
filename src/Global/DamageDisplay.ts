import { HeroStats } from "./HeroStats";

export class DamageDisplay {
    private static DamagedAfterAmount: number | null;
    private static DamageWasCrit: boolean | null = false;
    private static DamageWasBlocked: boolean | null = false;

    public static get EventDamagedAfterAmount() { return this.DamagedAfterAmount || 0; }
    public static get EventDamageWasCrit() { return this.DamageWasCrit || false; }
    public static get EventDamageWasBlocked() { return this.DamageWasBlocked || false; }

    private static TTXVEL = 0.083203125 * Cos(90*bj_DEGTORAD);
    private static TTYVEL = 0.083203125 * Sin(90*bj_DEGTORAD);

    static init() {
        const t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED);
        TriggerAddAction(t, () => {

            let damage = GetEventDamage();
            this.DamageWasCrit = false;
            this.DamagedAfterAmount = null;
            if (damage == 0) return;

            const source = GetEventDamageSource();
            const target = BlzGetEventDamageTarget();
            const attackType = BlzGetEventAttackType();
            const damageType = BlzGetEventDamageType();

            const owner = GetOwningPlayer(source);
            let size = (damage / 60) * 3 + 8;
            let multiplier = 1.0;

            let rgb = [ 100, 100, 100 ];
            if (attackType == ATTACK_TYPE_MELEE) rgb = [ 100, 100, 100 ];
            else if (attackType == ATTACK_TYPE_MELEE) rgb = [ 25, 50, 100 ];

            const stats = new HeroStats(source);
            multiplier = stats.CritChance();
            if (multiplier > 1.0) {
                size *= multiplier;
                damage *= multiplier;
                this.DamageWasCrit = true;
                rgb[0] = 100;
                rgb[1] = rgb[1] * 0.3;
                rgb[2] = rgb[2] * 0.3;
            }

            let dString = math.floor(damage)+"";
            BlzSetEventDamage(damage);
            this.DamagedAfterAmount = damage;
            CreateTextTagUnitBJ(dString, target, 50.00, size, rgb[0], rgb[1], rgb[2], 0)
            if (owner == GetLocalPlayer()) {
                SetTextTagVelocity(bj_lastCreatedTextTag, this.TTXVEL, this.TTYVEL)
                SetTextTagLifespan(bj_lastCreatedTextTag, 2.5)
                SetTextTagPermanent(bj_lastCreatedTextTag, false)
                SetTextTagFadepoint(bj_lastCreatedTextTag, 1.40)

            } else {
                    SetTextTagVisibility(bj_lastCreatedTextTag, false)
            }
        });
    }
}