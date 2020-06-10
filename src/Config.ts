import { RequirementType as Req } from "Systems/Requirement/RequirementTracker";

export function InitConfiguration() {
    
    let models = Object.keys(Models);
    for (let m of models) {
        Preload(m);
    }
}

export const Spells = {
    SummonMelee:               FourCC('A001'),
    SummonRanged:              FourCC('A002'),

    Rejuvenate:                FourCC('AP01'),
    Bless:                     FourCC('AP02'),
    Purge:                     FourCC('AP03'),
    Invigorate:                FourCC('AP04'),
    Endure:                    FourCC('AP05'),
    Justice:                   FourCC('AP06'),
    Redemption:                FourCC('AP08'),
    GuardianAngel:             FourCC('AP09'),
    Exorcism:                  FourCC('AP07'),
    PaladinMastery:            FourCC('A00F'),
    PaladinLearnMastery:       FourCC('APMB'),
    PaladinRestoration:        FourCC('A00E'),
    PaladinDetermination:      FourCC('A00C'),
    PaladinRepentance:         FourCC('A00D'),
    PalLearnRestoration:       FourCC('A00A'),
    PalLearnDetermination:     FourCC('A003'),
    PalLearnRepentance:        FourCC('A009'),
    Perseverance:              FourCC('A014'),

    Taint:                     FourCC('AW01'),
    CrazyImp:                  FourCC('AW02'),
    ContagiousInsanity:        FourCC('AW03'),
    RitualOfDeath:             FourCC('AW04'),
    DarkPortal:                FourCC('AW08'),
    StealEssence:              FourCC('AW06'),
    DemonismShadowcraft:       FourCC('A00I'),
    SummonEvilOutsider:        FourCC('A00K'),
    BloodFeast:                FourCC('AW07'),
    CallSuccubus:              FourCC('AW05'),
    SacrificeMastery:          FourCC('A016'),
    Paranoia:                  FourCC('AW09'),

    SummonGhoul:               FourCC('A02O'),
    SummonAbomination:         FourCC('A02P'),
    DeathKnightMight:          FourCC('A02Z'),
    DeathKnightWill:           FourCC('A030'),
    AntimagicShell:            FourCC('A02Q'),

    VolatileLeeches:           FourCC('ADK1'),
    CorruptedBlood:            FourCC('ADK2'),
    VampiresBoon:              FourCC('ADK3'),
    DeathVolley:               FourCC('ADK4'),
    AntimagicZone:             FourCC('ADK5'),
    UnholyCurse:               FourCC('ADK6'),
    DeathsEmbrace:             FourCC('ADK7'),
    DeathAndDecay:             FourCC('ADK8'),
    ArmyOfTheDead:             FourCC('ADK9'),


    WhitePower:                FourCC('A00T'),
    RedPower:                  FourCC('A028'),
    DarkPower:                 FourCC('A03G'),
    DarkFocusRedChoice:        FourCC('A00P'),
    DarkFocusBlueChoice:       FourCC('A00Q'),
    DarkArtBlood:               FourCC('A02W'),
    DarkArtUnholy:              FourCC('A02X'),
    DarkArtNecromancy:          FourCC('A02Y'),
}

export const Auras = {
    LaneDrainImmunity:         FourCC('A031'),
    LanePersistance:           FourCC('A03L'),
    WildGrowth:                FourCC('A012'),
    HolyPower:                 FourCC('A00T'),
    HotStreak:                 FourCC('A00Z'),
    Ignite:                    FourCC('A011'),
    Taint1:                    FourCC('A00V'),
    Taint2:                    FourCC('A00W'),
    Demonism:                  FourCC('A03D'),
    Shadowcraft:               FourCC('A03E'),
    DarkPortalLifeBonus:       FourCC('A03J'),
    Perseverance:              FourCC('A013'),
    GuardianAngel:             FourCC('A004'),
    Reincarnation:             FourCC('A008'),
    BloodFeastHpBonus:         FourCC('A00G'),
    BloodFeastDamageBonus:     FourCC('A012'),
    AmzSpellImmunity:          FourCC('A039'),
    VolatileLeechesDamage:     FourCC('A02H'),
    VolatileLeechesBites:      FourCC('A02G'),
    VampiresBoon:              FourCC('A032'),
    ArmyOfTheDead:             FourCC('A03B'),
}

export const Dummies = {
    AvengersShield:            FourCC('A00U'),
    Pyroblast:                 FourCC('A00Y'),
    Bless:                     FourCC('A007'),
    Purge:                     FourCC('A03C'),
    Invigorate:                FourCC('A005'),
    Endure:                    FourCC('A00B'),
    Taint:                     FourCC('A00J'),
    ContagiousInsanity:        FourCC('A010'),
    Paranoia:                  FourCC('A02M'),
    AntimagicZone:             FourCC('A038'),
    DeathVolley:               FourCC('A037'),
    CorruptedBlood:            FourCC('A02I'),
    DeathAndDecay:             FourCC('A034'),
    UnholyCurse:               FourCC('A036'),
}

export const Buffs = {
    WildGrowth:                FourCC('B000'),
    HolyPower:                 FourCC('B001'),
    DivineProtection:          FourCC('B003'),
    HotStreak:                 FourCC('B004'),
    HeatingUp:                 FourCC('B006'),
    ManaShield:                FourCC('BNms'),
    Ignite:                    FourCC('B005'),
    CorruptedBlood:            FourCC('B00Z'),
    Taint:                     FourCC('B009'),
    Demonism:                  FourCC('B016'),
    Shadowcraft:               FourCC('B008'),
    ContagiousInsanity:        FourCC('B00A'),
    AntimagicZone:             FourCC('B015'),
    UnholyCurse:               FourCC('B013'),
    ArmyOfTheDead:             FourCC('B012'),
}

export const Upgrades = {
    SpellCircle:                FourCC('R001'),
    BlueOrbs:                   FourCC('R0OB'),
    WhiteOrbs:                  FourCC('R0OW'),
    RedOrbs:                    FourCC('R0OR'),
    PurpleOrbs:                 FourCC('R0OP'),
    SummoningOrbs:              FourCC('R0OS'),
    AnyOrbs:                    FourCC('R0OA'),
}

export const RequirementUpgrades: Record<number, Req[]> = {
    [FourCC('R00B')]: [Req.White, Req.White, Req.Red],
    [FourCC('R00D')]: [Req.Summoning, Req.Summoning],
    [FourCC('R016')]: [Req.Summoning],
    [FourCC('R015')]: [Req.White, Req.White, Req.White],
    [FourCC('R014')]: [Req.White, Req.White, Req.Blue],
    [FourCC('R013')]: [Req.White, Req.White, Req.Purple],
    [FourCC('R012')]: [Req.Purple, Req.Red],
    [FourCC('R011')]: [Req.White, Req.White, Req.Red, Req.Blue, Req.Mastery, Req.Mastery],
    [FourCC('R010')]: [Req.White, Req.White, Req.Blue, Req.Purple, Req.Mastery, Req.Mastery],
    [FourCC('R00Z')]: [Req.White, Req.White, Req.Red, Req.Purple, Req.Mastery, Req.Mastery],
    [FourCC('R00Y')]: [Req.Purple, Req.Red],
    [FourCC('R00X')]: [Req.Purple, Req.Summoning],
    [FourCC('R00W')]: [Req.Blue],
    [FourCC('R00V')]: [Req.Purple, Req.Red],
    [FourCC('R00U')]: [Req.Purple, Req.Purple, Req.Red, Req.Summoning],
    [FourCC('R00T')]: [Req.Purple, Req.Purple, Req.Blue, Req.Red],
    [FourCC('R018')]: [Req.Purple, Req.Purple, Req.Red, Req.Red, Req.Mastery, Req.Mastery],
    [FourCC('R00R')]: [Req.Purple, Req.Red, Req.Summoning, Req.Mastery, Req.Mastery],
    [FourCC('R00Q')]: [Req.Purple, Req.Purple, Req.Blue, Req.Mastery, Req.Mastery],
    // Ritual
    [FourCC('R00J')]: [Req.Purple, Req.Purple, Req.Red],

    // Abom
    [FourCC('R00P')]: [Req.Red, Req.Summoning],
    // Leech
    [FourCC('R00O')]: [Req.Red, Req.Red, Req.Summoning,                             Req.DarkArtBlood],
    // Volley
    [FourCC('R00H')]: [Req.Red, Req.Red, Req.Blue, Req.Purple,                      Req.DarkArtUnholy],
    // Embrace
    [FourCC('R00L')]: [Req.Red, Req.Blue,                                           Req.DarkArtNecromancy],
    // CorrBlood
    [FourCC('R00M')]: [Req.Red, Req.Red,                                            Req.DarkArtBlood],
    // Amz
    [FourCC('R00K')]: [Req.Red, Req.Blue, Req.Blue,                                 Req.DarkArtUnholy],
    // Dnd
    [FourCC('R00N')]: [Req.Red, Req.Purple, Req.Blue,                               Req.DarkArtNecromancy],
    // Boon
    [FourCC('R00I')]: [Req.Red, Req.Red, Req.Purple,                                Req.DarkArtBlood],
    // curse
    [FourCC('R00F')]: [Req.Red, Req.Red, Req.Purple,                                Req.DarkArtUnholy],
    // Army
    [FourCC('R00G')]: [Req.Red, Req.Red, Req.Blue, Req.Purple,                      Req.DarkArtNecromancy],
    // [FourCC('R00E')]: [Req.Red, Req.White, Req.Red, Req.Purple],
    // [FourCC('R017')]: [Req.Red, Req.White, Req.Red, Req.Purple],
    // [FourCC('R00C')]: [Req.Red, Req.White, Req.Red, Req.Purple],
    // [FourCC('R00S')]: [Req.Red, Req.White, Req.Red, Req.Purple],

    [FourCC('R01A')]: [Req.DarkArtBlood],
    [FourCC('R01B')]: [Req.DarkArtUnholy],
    [FourCC('R019')]: [Req.DarkArtNecromancy],
}

export const ReqUnits = {
    // SpellCircle:               [FourCC('h01'), FourCC(''), FourCC(''), FourCC('')],
    BlueOrbs:                  [FourCC('h00Z'), FourCC('h010'), FourCC('h011'), FourCC('h012')],
    PurpleOrbs:                [FourCC('h01B'), FourCC('h01C'), FourCC('h01D'), FourCC('h01E')],
    RedOrbs:                   [FourCC('h016'), FourCC('h014'), FourCC('h015'), FourCC('h013')],
    WhiteOrbs:                 [FourCC('h017'), FourCC('h018'), FourCC('h019'), FourCC('h01A')],
    SummoningOrbs:             [FourCC('h01F'), FourCC('h01G'), FourCC('h01H'), FourCC('h01I')],
    Blank:                      [],
}

export const Items = {
    GemBlue:                    FourCC('IB0B'),
    GemRed:                     FourCC('IB0R'),
    GemWhite:                   FourCC('IB0W'),
    GemPurple:                  FourCC('IB0P'),
    GemSummoning:               FourCC('IB0S'),
    GemVoid:                    FourCC('I00V'),

    Buy3Gems:                   FourCC('I000'),
    WhitePowerStacks:           FourCC('I00F'),
    DarkFocusBase:              FourCC('I0D0'),
    DarkFocusBlue:              FourCC('I002'),
    DarkFocusPurpleRed:         FourCC('I0D1'),
    DarkFocusPurpleBlue:        FourCC('I004'),
    DarkFocusRed:               FourCC('I001'),
    RedPowerStacks:             FourCC('I00J'),

    PaladinBook1:               FourCC('IP01'),
    PaladinBook2:               FourCC('IP02'),
    PaladinBook3:               FourCC('IP03'),

    WarlockBook1:               FourCC('IW01'),
    WarlockBook2:               FourCC('IW02'),
    WarlockBook3:               FourCC('IW03'),

    DeathKnightDarkArts:        FourCC('I00I'),
}

export const Units = {
    DUMMY:                     FourCC('nDUM'),
    NegativeZDummy:            FourCC('h00X'),
    Paladin:                   FourCC('HPAL'),
    Warlock:                   FourCC('HPL3'),
    Elementalist:              FourCC('HELE'),
    DeathKnight:               FourCC('H00H'),
    Inquisitor:                FourCC('H00D'),

    VolatileLeeches:           FourCC('n00E'),

    Abomination1:              FourCC('u00B'),
    Abomination2:              FourCC('u00C'),
    Abomination3:              FourCC('u00D'),
    Abomination4:              FourCC('u00E'),
    Abomination5:              FourCC('u00F'),
    Abomination6:              FourCC('u00G'),
    Abomination7:              FourCC('u00H'),
    Abomination8:              FourCC('u00I'),
    Abomination9:              FourCC('u00J'),
    Abomination10:             FourCC('u00B'),

    Ghoul1:                    FourCC('u001'),
    Ghoul2:                    FourCC('u002'),
    Ghoul3:                    FourCC('u003'),
    Ghoul4:                    FourCC('u004'),
    Ghoul5:                    FourCC('u005'),
    Ghoul6:                    FourCC('u006'),
    Ghoul7:                    FourCC('u007'),
    Ghoul8:                    FourCC('u008'),
    Ghoul9:                    FourCC('u009'),
    Ghoul10:                   FourCC('u00A'),

    DarkArtBloodUnlocked:      FourCC('h00U'),
    DarkArtUnholyUnlocked:     FourCC('h00V'),
    DarkArtNecromancyUnlocked: FourCC('h00W'),

    CacoDemon:                 FourCC('nD0J'),
    EvilEye:                   FourCC('nD0K'),
    Gargoyle:                  FourCC('nD0L'),
    VileTemptress:             FourCC('nD0M'),
    Hydralisk:                 FourCC('nD0N'),
    Destroyer:                 FourCC('nD0O'),
    Ocula:                     FourCC('nD0P'),
    DemonLord:                 FourCC('nD0Q'),
    EredarSorcerer:            FourCC('nD0R'),
    Overfiend:                 FourCC('nD0S'),

    Wig:                       FourCC('nD00'),
    FelHound:                  FourCC('nD01'),
    ClawDevil:                 FourCC('nD02'),
    FelGuard:                  FourCC('nD03'),
    FacelessOne:               FourCC('nD04'),
    Oni:                       FourCC('nD05'),
    DemonSlasher:              FourCC('nD06'),
    DemonBlademaster:          FourCC('nD07'),
    DoomGuard:                 FourCC('nD08'),
    PitLord:                   FourCC('nD09'),

    Voidwalker:                FourCC('h0H0'),
    Carnage:                   FourCC('h0H1'),
    Whisperer:                 FourCC('h0H2'),
    DreamEater:                FourCC('h0H3'),
    GreaterCarnage:            FourCC('h0H4'),
    Fear:                      FourCC('h0H5'),
    OldOnesSpawn:              FourCC('h0H6'),
    Hate:                      FourCC('h0H7'),
    ShadowGolem:               FourCC('h0H8'),

    Succubus1:                 FourCC('nD0A'),
    Succubus2:                 FourCC('nD0A'),
    Succubus3:                 FourCC('nD0A'),
    Succubus4:                 FourCC('nD0A'),

    Woodcutter:                FourCC('hF00'),
    Militia:                   FourCC('hF01'),
    Enforcer:                  FourCC('hF02'),
    Footman:                   FourCC('hF03'),
    Swordsman:                 FourCC('hF04'),
    Captain:                   FourCC('hF05'),
    HorsemanKnight:            FourCC('hF06'),
    Guardian:                  FourCC('hF07'),
    Templar:                   FourCC('hF08'),
    HolyKnight:                FourCC('hF09'),

    Peasant:                   FourCC('hR00'),
    Rogue:                     FourCC('hR01'),
    SpearThrower:              FourCC('hR02'),
    Archer:                    FourCC('hR03'),
    Ranger:                    FourCC('hR04'),
    Rifleman:                  FourCC('hR05'),
    Sharpshooter:              FourCC('hR06'),
    MortarTeam:                FourCC('hR07'),
    FlyingMachine:             FourCC('hR08'),
    GryphonRider:              FourCC('hR09'),

    DarkPortal:                FourCC('h00Q'),
    CrazyImp1:                  FourCC('h00M'),
    CrazyImp2:                  FourCC('h00N'),
    CrazyImp3:                  FourCC('h00O'),
    CrazyImp4:                  FourCC('h00P'),


}

export const SpawnedUnitTypes = {
    Human: [
        Units.Woodcutter,
        Units.Militia,
        Units.Enforcer,
        Units.Footman,
        Units.Swordsman,
        Units.Captain,
        Units.HorsemanKnight,
        Units.Guardian,
        Units.Templar,
        Units.HolyKnight,

        Units.Peasant,
        Units.Rogue,
        Units.SpearThrower,
        Units.Archer,
        Units.Ranger,
        Units.Rifleman,
        Units.Sharpshooter,
        Units.MortarTeam,
        Units.FlyingMachine,
        Units.GryphonRider
    ],

    Undead: [
        Units.Ghoul1,
        Units.Ghoul2,
        Units.Ghoul3,
        Units.Ghoul4,
        Units.Ghoul5,
        Units.Ghoul6,
        Units.Ghoul7,
        Units.Ghoul8,
        Units.Ghoul9,
        Units.Ghoul10,
        Units.Abomination1,
        Units.Abomination2,
        Units.Abomination3,
        Units.Abomination4,
        Units.Abomination5,
        Units.Abomination6,
        Units.Abomination7,
        Units.Abomination8,
        Units.Abomination9,
        Units.Abomination10,
    ],

    Demon: [
        Units.Wig,
        Units.FelHound,
        Units.ClawDevil,
        Units.FelGuard,
        Units.FacelessOne,
        Units.Oni,
        Units.DemonSlasher,
        Units.DemonBlademaster,
        Units.DoomGuard,
        Units.PitLord,
        Units.CacoDemon,
        Units.EvilEye,
        Units.Gargoyle,
        Units.VileTemptress,
        Units.Hydralisk,
        Units.Destroyer,
        Units.Ocula,
        Units.DemonLord,
        Units.EredarSorcerer,
        Units.Overfiend,
        
        Units.CrazyImp1,
        Units.CrazyImp2,
        Units.CrazyImp3,
        Units.CrazyImp4
    ],

    Horror: [
        Units.Voidwalker,
        Units.Carnage,
        Units.Whisperer,
        Units.DreamEater,
        Units.GreaterCarnage,
        Units.Fear,
        Units.OldOnesSpawn,
        Units.Hate, 
        Units.ShadowGolem,
    ]
}

let path = 'ReplaceableTextures\\CommandButtons\\'
export const Icons = {
    Regeneration:              path + "BTNRegenerate.blp",
    Rejuvenation:              path + "BTNRejuvenation.blp",
    Butterflies:               path + "BTNANA_HealingButterfliesFixed.BLP",
    GreenBearPaw:              path + "BTNBear-Paw-Blue.blp",
    Revitalize:                path + "BTNReplenish.blp",
    MarkOfTheWild:             path + "BTNSpell_Nature_Regeneration.blp",
    Regrowth:                  path + "BTNSpell_Nature_ResistNature.blp",
    HealingTouch:              path + "BTNSpell_Nature_HealingTouch.blp",
    Furor:                     path + "BTNSpell_Nature_UnyeildingStamina.blp",
    Nourish:                   path + "BTNability_druid_nourish.blp",
    SwiftRejuvenation:         path + "BTNability_druid_empoweredrejuvination.blp",
    EmpoweredTouch:            path + "BTNability_druid_empoweredtouch.blp",
    Swiftmend:                 path + "BTNinv_relics_idolofrejuvenation.blp",
    Efflorescence:             path + "BTNinv_misc_herb_talandrasrose.blp",
    WildGrowth:                path + "BTNNatureHealingRay.blp",
    NaturesMajesty:            path + "BTNAdvancedStrengthOfTheMoon.blp",
    Toughness:                 path + "BTNspell_holy_devotion.blp",
    CrusaderStrike:            path + "BTNspell_holy_crusaderstrike.blp",
    Judgement:                 path + "BTNHolyBash.blp",
    WordOfGlory:               path + "BTNHeal.blp",
    Vindication:               path + "BTNspell_holy_vindication.blp",
    AvengersShield:            path + "BTNspell_holy_avengersshield.blp",
    EternalGlory:              path + "BTNHealingWave.blp",
    Divinity:                  path + "BTNspell_holy_blindingheal.blp",
    JudgementsOfTheWise:       path + "BTNSorceressMaster.blp",
    TouchedByTheLight:         path + "BTNability_paladin_touchedbylight.blp",
    DivineProtection:          path + "BTNHumanArmorUpThree.blp",
    DevotionAura:              path + "BTNDevotion.blp",
    JudgementArmor:            path + "BTNHoly Paladin.blp",
    FireBlast:                 path + "BTNspell_fire_fireball.blp",
    Scorch:                    path + "BTNSoulBurn.blp",
    Pyroblast:                 path + "BTNSpell_Fire_Fireball02.blp",
    Firestarter:               path + "BTNspell_fire_playingwithfire.blp",
    ImprovedScorch:            path + "BTNSoulBurn.blp",
    Ignite:                    path + "BTNIncinerate.blp",
    Wildfire:                  path + "BTNability_mage_worldinflames.blp",
    HotStreak:                 path + "BTNability_mage_hotstreak.blp",
    Impact:                    path + "BTNWallOfFire.blp",
    CriticalMass:              path + "BTNability_mage_firestarter.blp",
    Incinerate:                path + "BTNIncinerateWoW.blp",
}

path = "Models/"
export const Models = {
    Rejuvenation:             path + "GreenHealthSpinny20.mdl",
    Rejuvenation2:            path + "GreenHealthSpinny22.mdl",
    Swiftmend:                path + "Green Light.mdl",
    Nourish:                  path + "Healing Surge_01.mdl",
    Tranquility:              path + "AIreTarget_Green.mdl",
    Radiance:                 path + "Radiance Holy.mdl",
    HotStreak:                path + "DoomTarget_01.mdl",
    HeatingUp:                "Abilities/Spells/Orc/SpiritLink/SpiritLinkTarget.mdl",
    AirstrikeRocket:          path + "Airstrike Rocket.mdl",
    FireCrescent:             path + "Fire Crescent Tailed.mdl",
    SingularityOrange:        "SingularityOrange.mdl",
    CorpseBomb:               "CorpseBomb.mdl",
    HealingWave:              "Abilities\\Spells\\Orc\\HealingWave\\HealingWaveTarget.mdl",
    MassTeleportDemon:        "MassTeleportCasterDemon.mdl",
    ForceField:               "ForceField.mdl",
    BloodExplosion:           "BloodExplosion.mdl",

    CastDetermination:        "DeterminationCastAnimMajor.mdl",
    CastRestoration:          "HolyCastAnimMajor.mdl",
    CastRepentance:           "RepentanceCastAnimCenteredScaledUp_00.mdl",

    CastSacrifice:            "SacrificeCastAnimTall_09x170_extraphat.mdl",
    CastSummoningInstant:     "MagicCircle_Demon.mdl",
    CastSummoning:            "MagicCircle_DemonStand_03.mdl",
    CastShadow:               "ShadowCast_02.mdl",

    CastUnholy:               "UnholyCastAnim_03.mdx",
    CastNecromancy:           "DarknessRising05.mdx",
}

path = "ReplaceableTextures\\CommandButtons"
export const Textures = {
    BallBlue:                  path + "\\BTNBlueBall.mdl",
    BallPurple:                path + "\\BTNPurpleBall.mdl",
    BallRed:                   path + "\\BTNRedBall.mdl",
    BallWhite:                 path + "\\BTNWhiteBall.mdl",
    BallSummoning:             path + "\\BTNSummoningBall.blp",

    DisBallBlue:               path + "Disabled\\DISBTNBlueBall.blp",
    DisBallPurple:             path + "Disabled\\DISBTNPurpleBall.blp",
    DisBallRed:                path + "Disabled\\DISBTNRedBall.blp",
    DisBallWhite:              path + "Disabled\\DISBTNWhiteBall.blp",
    DisBallSummoning:          path + "Disabled\\DISBTNSummoningBall.blp",
}
