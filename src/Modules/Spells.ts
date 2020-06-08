import { SummonMelee } from "Spells/Paladin/SummonMelee";
import { SummonRanged } from "Spells/Paladin/SummonRanged";
import { Rejuvenate } from "Spells/Paladin/Rejuvenate";
import { SpellHelper } from "Global/SpellHelper";
import { Bless } from "Spells/Paladin/Bless";
import { Purge } from "Spells/Paladin/Purge";
import { Invigorate } from "Spells/Paladin/Invigorate";
import { Endure } from "Spells/Paladin/Endure";
import { Justice } from "Spells/Paladin/Justice";
import { SummonEvilOutsider } from "Spells/Warlock/SummonEvilOutsider";
import { DemonismShadowcraft } from "Spells/Warlock/DemonismShadowcraft";
import { Taint } from "Spells/Warlock/Taint";
import { CrazyImp } from "Spells/Warlock/CrazyImp";
import { ContagiousInsanity } from "Spells/Warlock/ContagiousInsanity";
import { RitualOfDeath } from "Spells/Warlock/RitualOfDeath";
import { DarkPortal } from "Spells/Warlock/DarkPortal";
import { StealEssence } from "Spells/Warlock/StealEssence";
import { WhitePower } from "Spells/Paladin/WhitePower";
import { DarkPower } from "Spells/Warlock/DarkPower";
import { SacrificeMastery } from "Spells/Warlock/SacrificeMastery";
import { Perseverance } from "Spells/Paladin/Perseverance";
import { Redemption } from "Spells/Paladin/Redemption";
import { GuardianAngel } from "Spells/Paladin/GuardianAngel";
import { Exorcism } from "Spells/Paladin/Exorcism";
import { CallSuccubus } from "Spells/Warlock/CallSuccubus";
import { BloodFeast } from "Spells/Warlock/BloodFeast";
import { Paranoia } from "Spells/Warlock/Paranoia";
import { AntimagicZone } from "Spells/DeathKnight/AntimagicZone";
import { VolatileLeeches } from "Spells/DeathKnight/VolatileLeeches";
import { DeathVolley } from "Spells/DeathKnight/DeathVolley";
import { SummonGhoul } from "Spells/DeathKnight/SummonGhoul";
import { SummonAbomination } from "Spells/DeathKnight/SummonAbomination";
import { DeathsEmbrace } from "Spells/DeathKnight/DeathsEmbrace";
import { CorruptedBlood } from "Spells/DeathKnight/CorruptedBlood";
import { DeathAndDecay } from "Spells/DeathKnight/DeathAndDecay";
import { VampiresBoon } from "Spells/DeathKnight/VampiresBoon";
import { UnholyCurse } from "Spells/DeathKnight/UnholyCurse";
import { ArmyOfTheDead } from "Spells/DeathKnight/ArmyOfTheDead";
import { RedPower } from "Spells/DeathKnight/RedPower";
import { Spells, Buffs, Models, Auras, Dummies, Upgrades, RequirementUpgrades } from "Config";
import { UpgradeTracker } from "./Globals";
import { OrbType } from "Systems/OrbResource/OrbType";
import { RequirementType } from "Systems/Requirement/RequirementTracker";


export function InitializeSpells() {
    // print("initializing shit spells");
    // Paladin
    WhitePower.init(Spells.WhitePower);
    SummonMelee.init(Spells.SummonMelee);
    SummonRanged.init(Spells.SummonRanged);
    Perseverance.init(Spells.Perseverance);
    Rejuvenate.init(Spells.Rejuvenate, Buffs.CorruptedBlood, Models.CastRestoration);
    Bless.init(Spells.Bless);
    Purge.init(Spells.Purge);
    Invigorate.init(Spells.Invigorate);
    Endure.init(Spells.Endure);
    Justice.init(Spells.Justice);
    Redemption.init(Spells.Redemption);
    GuardianAngel.init(Spells.GuardianAngel);
    Exorcism.init(Spells.Exorcism);

    // Warlock
    DarkPower.init(Spells.DarkPower);
    SummonEvilOutsider.init(Spells.SummonEvilOutsider);
    DemonismShadowcraft.init(Spells.DemonismShadowcraft);
    SacrificeMastery.init(Spells.SacrificeMastery);
    Taint.init(Spells.Taint);
    CrazyImp.init(Spells.CrazyImp);
    ContagiousInsanity.init(Spells.ContagiousInsanity);
    RitualOfDeath.init(Spells.RitualOfDeath);
    DarkPortal.init(Spells.DarkPortal);
    StealEssence.init(Spells.StealEssence);
    BloodFeast.init(Spells.BloodFeast);
    CallSuccubus.init(Spells.CallSuccubus);
    Paranoia.init(Spells.Paranoia);

    // Death Knight
    RedPower.init(Spells.RedPower);
    SummonGhoul.init(Spells.SummonGhoul);
    SummonAbomination.init(Spells.SummonAbomination);
    VolatileLeeches.init(Spells.VolatileLeeches);
    DeathVolley.init(Spells.DeathVolley);
    CorruptedBlood.init(Spells.CorruptedBlood);
    DeathsEmbrace.init(Spells.DeathsEmbrace);
    AntimagicZone.init(Spells.AntimagicZone);
    DeathAndDecay.init(Spells.DeathAndDecay);
    VampiresBoon.init(Spells.VampiresBoon);
    UnholyCurse.init(Spells.UnholyCurse);
    ArmyOfTheDead.init(Spells.ArmyOfTheDead);
}

export function PreloadSpells() {
    SpellHelper.Preload(Spells.Rejuvenate);
    SpellHelper.Preload(Spells.SummonMelee);
    SpellHelper.Preload(Spells.SummonRanged);
    SpellHelper.Preload(Spells.WhitePower);
    SpellHelper.Preload(Spells.Bless);
    SpellHelper.Preload(Spells.Purge);
    SpellHelper.Preload(Spells.Invigorate);
    SpellHelper.Preload(Spells.Endure);
    SpellHelper.Preload(Spells.Justice);
    SpellHelper.Preload(Spells.Redemption);
    SpellHelper.Preload(Spells.GuardianAngel);
    SpellHelper.Preload(Spells.Exorcism);

    SpellHelper.Preload(Spells.SummonEvilOutsider);
    SpellHelper.Preload(Spells.DemonismShadowcraft);
    SpellHelper.Preload(Spells.Taint);
    SpellHelper.Preload(Spells.CrazyImp);
    SpellHelper.Preload(Spells.ContagiousInsanity);
    SpellHelper.Preload(Spells.RitualOfDeath);
    SpellHelper.Preload(Spells.DarkPortal);
    SpellHelper.Preload(Spells.StealEssence);
    SpellHelper.Preload(Spells.BloodFeast);
    SpellHelper.Preload(Spells.CallSuccubus);

    SpellHelper.Preload(Spells.AntimagicZone);
    SpellHelper.Preload(Spells.VolatileLeeches);
    SpellHelper.Preload(Spells.DeathVolley);
    SpellHelper.Preload(Spells.DeathsEmbrace);
    SpellHelper.Preload(Spells.CorruptedBlood);
    SpellHelper.Preload(Spells.DeathAndDecay);
    SpellHelper.Preload(Spells.VampiresBoon);
    SpellHelper.Preload(Spells.UnholyCurse);
    SpellHelper.Preload(Spells.ArmyOfTheDead);

    SpellHelper.Preload(Auras.BloodFeastDamageBonus);
    SpellHelper.Preload(Auras.BloodFeastHpBonus);
    SpellHelper.Preload(Auras.AmzSpellImmunity);
    SpellHelper.Preload(Auras.VampiresBoon);
    SpellHelper.Preload(Auras.ArmyOfTheDead);
    SpellHelper.Preload(Dummies.AntimagicZone);
    SpellHelper.Preload(Dummies.DeathVolley);
    SpellHelper.Preload(Dummies.CorruptedBlood);
    SpellHelper.Preload(Dummies.DeathAndDecay);

    SpellHelper.Preload(Auras.VolatileLeechesBites);

    let keys = Object.keys(RequirementUpgrades) as unknown as RequirementType[];
    for (let k of keys) {
        let req = RequirementUpgrades[k];
        UpgradeTracker.Register(k, req);
    }

    SpellHelper.ExecuteSpellPreload();
}