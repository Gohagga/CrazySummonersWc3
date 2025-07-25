function initConfig()
    Spells:init()
    Auras:init()
    Dummies:init()
    Buffs:init()
    Upgrades:init()
    Units:init()
    Icons:init()
    Models:init()
    Textures:init()
end
Spells = {}
Spells.name = "Spells"
Spells.__index = Spells
Spells.prototype = {}
Spells.prototype.__index = Spells.prototype
Spells.prototype.constructor = Spells
function Spells.new(...)
    local self = setmetatable({}, Spells.prototype)
    self:____constructor(...)
    return self
end
function Spells.prototype.____constructor(self)
end
function Spells.init(self)
end
Spells.SummonMelee = FourCC("A001")
Spells.SummonRanged = FourCC("A002")
Spells.Rejuvenate = FourCC("AP01")
Spells.Bless = FourCC("AP02")
Spells.Purge = FourCC("AP03")
Spells.Invigorate = FourCC("AP04")
Spells.Endure = FourCC("AP05")
Spells.Justice = FourCC("AP06")
Spells.Redemption = FourCC("AP08")
Spells.GuardianAngel = FourCC("AP09")
Spells.Exorcism = FourCC("AP07")
Spells.PaladinMastery = FourCC("A00F")
Spells.PaladinLearnMastery = FourCC("APMB")
Spells.PaladinRestoration = FourCC("A00E")
Spells.PaladinDetermination = FourCC("A00C")
Spells.PaladinRepentance = FourCC("A00D")
Spells.PalLearnRestoration = FourCC("A00A")
Spells.PalLearnDetermination = FourCC("A003")
Spells.PalLearnRepentance = FourCC("A009")
Spells.Perseverance = FourCC("A014")
Spells.Taint = FourCC("AW01")
Spells.CrazyImp = FourCC("AW02")
Spells.ContagiousInsanity = FourCC("AW03")
Spells.RitualOfDeath = FourCC("AW04")
Spells.DarkPortal = FourCC("AW08")
Spells.StealEssence = FourCC("AW06")
Spells.DemonismShadowcraft = FourCC("A00I")
Spells.SummonEvilOutsider = FourCC("A00K")
Spells.BloodFeast = FourCC("AW07")
Spells.CallSuccubus = FourCC("AW05")
Spells.SacrificeMastery = FourCC("A016")
Spells.Paranoia = FourCC("AW09")
Spells.SummonGhoul = FourCC("A02O")
Spells.SummonAbomination = FourCC("A02P")
Spells.DeathKnightMight = FourCC("A02Z")
Spells.DeathKnightWill = FourCC("A030")
Spells.AntimagicShell = FourCC("A02Q")
Spells.VolatileLeeches = FourCC("ADK1")
Spells.CorruptedBlood = FourCC("ADK2")
Spells.VampiresBoon = FourCC("ADK3")
Spells.DeathVolley = FourCC("ADK4")
Spells.AntimagicZone = FourCC("ADK5")
Spells.UnholyCurse = FourCC("ADK6")
Spells.DeathsEmbrace = FourCC("ADK7")
Spells.DeathAndDecay = FourCC("ADK8")
Spells.ArmyOfTheDead = FourCC("ADK9")
Spells.Fireball = FourCC("AE01")
Spells.IceBurst = FourCC("AE02")
Spells.ChainLightning = FourCC("AE03")
Spells.FlameBarrage = FourCC("AE04")
Spells.ChillingRay = FourCC("AE05")
Spells.ShockSpirit = FourCC("AE06")
Spells.Inferno = FourCC("AE07")
Spells.HandOfAhune = FourCC("AE08")
Spells.IonicChannel = FourCC("AE09")
Spells.AwakenEssence = FourCC("A01H")
Spells.WhitePower = FourCC("A00T")
Spells.RedPower = FourCC("A028")
Spells.DarkPower = FourCC("A03G")
Spells.DarkFocusRedChoice = FourCC("A00P")
Spells.DarkFocusBlueChoice = FourCC("A00Q")
Spells.EleBluePower = FourCC("A01N")
Spells.EleEleRedPower = FourCC("A00S")
Spells.ElePurplePower = FourCC("A01O")
Auras = {}
Auras.name = "Auras"
Auras.__index = Auras
Auras.prototype = {}
Auras.prototype.__index = Auras.prototype
Auras.prototype.constructor = Auras
function Auras.new(...)
    local self = setmetatable({}, Auras.prototype)
    self:____constructor(...)
    return self
end
function Auras.prototype.____constructor(self)
end
function Auras.init(self)
end
Auras.LaneDrainImmunity = FourCC("A031")
Auras.LanePersistance = FourCC("A03L")
Auras.WildGrowth = FourCC("A012")
Auras.HolyPower = FourCC("A00T")
Auras.HotStreak = FourCC("A00Z")
Auras.Ignite = FourCC("A011")
Auras.Taint1 = FourCC("A00V")
Auras.Taint2 = FourCC("A00W")
Auras.Demonism = FourCC("A03D")
Auras.Shadowcraft = FourCC("A03E")
Auras.DarkPortalLifeBonus = FourCC("A03J")
Auras.Perseverance = FourCC("A013")
Auras.GuardianAngel = FourCC("A004")
Auras.Reincarnation = FourCC("A008")
Auras.BloodFeastHpBonus = FourCC("A00G")
Auras.BloodFeastDamageBonus = FourCC("A012")
Auras.AmzSpellImmunity = FourCC("A039")
Auras.VolatileLeechesDamage = FourCC("A02H")
Auras.VolatileLeechesBites = FourCC("A02G")
Auras.VampiresBoon = FourCC("A032")
Auras.ArmyOfTheDead = FourCC("A03B")
Dummies = {}
Dummies.name = "Dummies"
Dummies.__index = Dummies
Dummies.prototype = {}
Dummies.prototype.__index = Dummies.prototype
Dummies.prototype.constructor = Dummies
function Dummies.new(...)
    local self = setmetatable({}, Dummies.prototype)
    self:____constructor(...)
    return self
end
function Dummies.prototype.____constructor(self)
end
function Dummies.init(self)
end
Dummies.AvengersShield = FourCC("A00U")
Dummies.Pyroblast = FourCC("A00Y")
Dummies.Bless = FourCC("A007")
Dummies.Purge = FourCC("A03C")
Dummies.Invigorate = FourCC("A005")
Dummies.Endure = FourCC("A00B")
Dummies.Taint = FourCC("A00J")
Dummies.ContagiousInsanity = FourCC("A010")
Dummies.Paranoia = FourCC("A02M")
Dummies.AntimagicZone = FourCC("A038")
Dummies.DeathVolley = FourCC("A037")
Dummies.CorruptedBlood = FourCC("A02I")
Dummies.DeathAndDecay = FourCC("A034")
Dummies.UnholyCurse = FourCC("A036")
Buffs = {}
Buffs.name = "Buffs"
Buffs.__index = Buffs
Buffs.prototype = {}
Buffs.prototype.__index = Buffs.prototype
Buffs.prototype.constructor = Buffs
function Buffs.new(...)
    local self = setmetatable({}, Buffs.prototype)
    self:____constructor(...)
    return self
end
function Buffs.prototype.____constructor(self)
end
function Buffs.init(self)
end
Buffs.WildGrowth = FourCC("B000")
Buffs.HolyPower = FourCC("B001")
Buffs.DivineProtection = FourCC("B003")
Buffs.HotStreak = FourCC("B004")
Buffs.HeatingUp = FourCC("B006")
Buffs.ManaShield = FourCC("BNms")
Buffs.Ignite = FourCC("B005")
Buffs.CorruptedBlood = FourCC("B00Z")
Buffs.Taint = FourCC("B009")
Buffs.Demonism = FourCC("B016")
Buffs.Shadowcraft = FourCC("B008")
Buffs.ContagiousInsanity = FourCC("B00A")
Buffs.AntimagicZone = FourCC("B015")
Buffs.UnholyCurse = FourCC("B013")
Buffs.ArmyOfTheDead = FourCC("B012")
Upgrades = {}
Upgrades.name = "Upgrades"
Upgrades.__index = Upgrades
Upgrades.prototype = {}
Upgrades.prototype.__index = Upgrades.prototype
Upgrades.prototype.constructor = Upgrades
function Upgrades.new(...)
    local self = setmetatable({}, Upgrades.prototype)
    self:____constructor(...)
    return self
end
function Upgrades.prototype.____constructor(self)
end
function Upgrades.init(self)
end
Upgrades.SpellCircle = FourCC("R001")
Upgrades.BlueOrbs = FourCC("R0OB")
Upgrades.WhiteOrbs = FourCC("R0OW")
Upgrades.RedOrbs = FourCC("R0OR")
Upgrades.PurpleOrbs = FourCC("R0OP")
Upgrades.SummoningOrbs = FourCC("R0OS")
Upgrades.AnyOrbs = FourCC("R0OA")
Items = {}
Items.name = "Items"
Items.__index = Items
Items.prototype = {}
Items.prototype.__index = Items.prototype
Items.prototype.constructor = Items
function Items.new(...)
    local self = setmetatable({}, Items.prototype)
    self:____constructor(...)
    return self
end
function Items.prototype.____constructor(self)
end
Items.GemBlue = FourCC("IB0B")
Items.GemRed = FourCC("IB0R")
Items.GemWhite = FourCC("IB0W")
Items.GemPurple = FourCC("IB0P")
Items.GemSummoning = FourCC("IB0S")
Items.GemVoid = FourCC("I00V")
Items.Buy3Gems = FourCC("I000")
Items.WhitePowerStacks = FourCC("I00F")
Items.DarkFocusBase = FourCC("I0D0")
Items.DarkFocusBlue = FourCC("I002")
Items.DarkFocusPurpleRed = FourCC("I0D1")
Items.DarkFocusPurpleBlue = FourCC("I004")
Items.DarkFocusRed = FourCC("I001")
Items.RedPowerStacks = FourCC("I00J")
Items.PaladinBook1 = FourCC("IP01")
Items.PaladinBook2 = FourCC("IP02")
Items.PaladinBook3 = FourCC("IP03")
Items.WarlockBook1 = FourCC("IW01")
Items.WarlockBook2 = FourCC("IW02")
Items.WarlockBook3 = FourCC("IW03")
Units = {}
Units.name = "Units"
Units.__index = Units
Units.prototype = {}
Units.prototype.__index = Units.prototype
Units.prototype.constructor = Units
function Units.new(...)
    local self = setmetatable({}, Units.prototype)
    self:____constructor(...)
    return self
end
function Units.prototype.____constructor(self)
end
function Units.init(self)
end
Units.DUMMY = FourCC("nDUM")
Units.NegativeZDummy = FourCC("h00X")
Units.Paladin = FourCC("HPAL")
Units.Warlock = FourCC("HPL3")
Units.Elementalist = FourCC("HELE")
Units.DeathKnight = FourCC("H00H")
Units.Inquisitor = FourCC("H00D")
Units.VolatileLeeches = FourCC("n00E")
Units.Abomination1 = FourCC("u00B")
Units.Abomination2 = FourCC("u00C")
Units.Abomination3 = FourCC("u00D")
Units.Abomination4 = FourCC("u00E")
Units.Abomination5 = FourCC("u00F")
Units.Abomination6 = FourCC("u00G")
Units.Abomination7 = FourCC("u00H")
Units.Abomination8 = FourCC("u00I")
Units.Abomination9 = FourCC("u00J")
Units.Abomination10 = FourCC("u00B")
Units.Ghoul1 = FourCC("u001")
Units.Ghoul2 = FourCC("u002")
Units.Ghoul3 = FourCC("u003")
Units.Ghoul4 = FourCC("u004")
Units.Ghoul5 = FourCC("u005")
Units.Ghoul6 = FourCC("u006")
Units.Ghoul7 = FourCC("u007")
Units.Ghoul8 = FourCC("u008")
Units.Ghoul9 = FourCC("u009")
Units.Ghoul10 = FourCC("u00A")
Units.CacoDemon = FourCC("nD0J")
Units.EvilEye = FourCC("nD0K")
Units.Gargoyle = FourCC("nD0L")
Units.VileTemptress = FourCC("nD0M")
Units.Hydralisk = FourCC("nD0N")
Units.Destroyer = FourCC("nD0O")
Units.Ocula = FourCC("nD0P")
Units.DemonLord = FourCC("nD0Q")
Units.EredarSorcerer = FourCC("nD0R")
Units.Overfiend = FourCC("nD0S")
Units.Wig = FourCC("nD00")
Units.FelHound = FourCC("nD01")
Units.ClawDevil = FourCC("nD02")
Units.FelGuard = FourCC("nD03")
Units.FacelessOne = FourCC("nD04")
Units.Oni = FourCC("nD05")
Units.DemonSlasher = FourCC("nD06")
Units.DemonBlademaster = FourCC("nD07")
Units.DoomGuard = FourCC("nD08")
Units.PitLord = FourCC("nD09")
Units.Voidwalker = FourCC("h0H0")
Units.Carnage = FourCC("h0H1")
Units.Whisperer = FourCC("h0H2")
Units.DreamEater = FourCC("h0H3")
Units.GreaterCarnage = FourCC("h0H4")
Units.Fear = FourCC("h0H5")
Units.OldOnesSpawn = FourCC("h0H6")
Units.Hate = FourCC("h0H7")
Units.ShadowGolem = FourCC("h0H8")
Units.Succubus1 = FourCC("nD0A")
Units.Succubus2 = FourCC("nD0A")
Units.Succubus3 = FourCC("nD0A")
Units.Succubus4 = FourCC("nD0A")
Units.Woodcutter = FourCC("hF00")
Units.Militia = FourCC("hF01")
Units.Enforcer = FourCC("hF02")
Units.Footman = FourCC("hF03")
Units.Swordsman = FourCC("hF04")
Units.Captain = FourCC("hF05")
Units.HorsemanKnight = FourCC("hF06")
Units.Guardian = FourCC("hF07")
Units.Templar = FourCC("hF08")
Units.HolyKnight = FourCC("hF09")
Units.Peasant = FourCC("hR00")
Units.Rogue = FourCC("hR01")
Units.SpearThrower = FourCC("hR02")
Units.Archer = FourCC("hR03")
Units.Ranger = FourCC("hR04")
Units.Rifleman = FourCC("hR05")
Units.Sharpshooter = FourCC("hR06")
Units.MortarTeam = FourCC("hR07")
Units.FlyingMachine = FourCC("hR08")
Units.GryphonRider = FourCC("hR09")
Units.DarkPortal = FourCC("h00Q")
Units.CrazyImp1 = FourCC("h00M")
Units.CrazyImp2 = FourCC("h00N")
Units.CrazyImp3 = FourCC("h00O")
Units.CrazyImp4 = FourCC("h00P")
SpawnedUnitTypes = {}
SpawnedUnitTypes.name = "SpawnedUnitTypes"
SpawnedUnitTypes.__index = SpawnedUnitTypes
SpawnedUnitTypes.prototype = {}
SpawnedUnitTypes.prototype.__index = SpawnedUnitTypes.prototype
SpawnedUnitTypes.prototype.constructor = SpawnedUnitTypes
function SpawnedUnitTypes.new(...)
    local self = setmetatable({}, SpawnedUnitTypes.prototype)
    self:____constructor(...)
    return self
end
function SpawnedUnitTypes.prototype.____constructor(self)
end
SpawnedUnitTypes.Human = {Units.Woodcutter, Units.Militia, Units.Enforcer, Units.Footman, Units.Swordsman, Units.Captain, Units.HorsemanKnight, Units.Guardian, Units.Templar, Units.HolyKnight, Units.Peasant, Units.Rogue, Units.SpearThrower, Units.Archer, Units.Ranger, Units.Rifleman, Units.Sharpshooter, Units.MortarTeam, Units.FlyingMachine, Units.GryphonRider}
SpawnedUnitTypes.Undead = {Units.Ghoul1, Units.Ghoul2, Units.Ghoul3, Units.Ghoul4, Units.Ghoul5, Units.Ghoul6, Units.Ghoul7, Units.Ghoul8, Units.Ghoul9, Units.Ghoul10, Units.Abomination1, Units.Abomination2, Units.Abomination3, Units.Abomination4, Units.Abomination5, Units.Abomination6, Units.Abomination7, Units.Abomination8, Units.Abomination9, Units.Abomination10}
SpawnedUnitTypes.Demon = {Units.Wig, Units.FelHound, Units.ClawDevil, Units.FelGuard, Units.FacelessOne, Units.Oni, Units.DemonSlasher, Units.DemonBlademaster, Units.DoomGuard, Units.PitLord, Units.CacoDemon, Units.EvilEye, Units.Gargoyle, Units.VileTemptress, Units.Hydralisk, Units.Destroyer, Units.Ocula, Units.DemonLord, Units.EredarSorcerer, Units.Overfiend, Units.CrazyImp1, Units.CrazyImp2, Units.CrazyImp3, Units.CrazyImp4}
SpawnedUnitTypes.Horror = {Units.Voidwalker, Units.Carnage, Units.Whisperer, Units.DreamEater, Units.GreaterCarnage, Units.Fear, Units.OldOnesSpawn, Units.Hate, Units.ShadowGolem}
local path = "ReplaceableTextures\\CommandButtons\\"
Icons = {}
Icons.name = "Icons"
Icons.__index = Icons
Icons.prototype = {}
Icons.prototype.__index = Icons.prototype
Icons.prototype.constructor = Icons
function Icons.new(...)
    local self = setmetatable({}, Icons.prototype)
    self:____constructor(...)
    return self
end
function Icons.prototype.____constructor(self)
end
function Icons.init(self)
end
Icons.Regeneration = tostring(path) .. "BTNRegenerate.blp"
Icons.Rejuvenation = tostring(path) .. "BTNRejuvenation.blp"
Icons.Butterflies = tostring(path) .. "BTNANA_HealingButterfliesFixed.BLP"
Icons.GreenBearPaw = tostring(path) .. "BTNBear-Paw-Blue.blp"
Icons.Revitalize = tostring(path) .. "BTNReplenish.blp"
Icons.MarkOfTheWild = tostring(path) .. "BTNSpell_Nature_Regeneration.blp"
Icons.Regrowth = tostring(path) .. "BTNSpell_Nature_ResistNature.blp"
Icons.HealingTouch = tostring(path) .. "BTNSpell_Nature_HealingTouch.blp"
Icons.Furor = tostring(path) .. "BTNSpell_Nature_UnyeildingStamina.blp"
Icons.Nourish = tostring(path) .. "BTNability_druid_nourish.blp"
Icons.SwiftRejuvenation = tostring(path) .. "BTNability_druid_empoweredrejuvination.blp"
Icons.EmpoweredTouch = tostring(path) .. "BTNability_druid_empoweredtouch.blp"
Icons.Swiftmend = tostring(path) .. "BTNinv_relics_idolofrejuvenation.blp"
Icons.Efflorescence = tostring(path) .. "BTNinv_misc_herb_talandrasrose.blp"
Icons.WildGrowth = tostring(path) .. "BTNNatureHealingRay.blp"
Icons.NaturesMajesty = tostring(path) .. "BTNAdvancedStrengthOfTheMoon.blp"
Icons.Toughness = tostring(path) .. "BTNspell_holy_devotion.blp"
Icons.CrusaderStrike = tostring(path) .. "BTNspell_holy_crusaderstrike.blp"
Icons.Judgement = tostring(path) .. "BTNHolyBash.blp"
Icons.WordOfGlory = tostring(path) .. "BTNHeal.blp"
Icons.Vindication = tostring(path) .. "BTNspell_holy_vindication.blp"
Icons.AvengersShield = tostring(path) .. "BTNspell_holy_avengersshield.blp"
Icons.EternalGlory = tostring(path) .. "BTNHealingWave.blp"
Icons.Divinity = tostring(path) .. "BTNspell_holy_blindingheal.blp"
Icons.JudgementsOfTheWise = tostring(path) .. "BTNSorceressMaster.blp"
Icons.TouchedByTheLight = tostring(path) .. "BTNability_paladin_touchedbylight.blp"
Icons.DivineProtection = tostring(path) .. "BTNHumanArmorUpThree.blp"
Icons.DevotionAura = tostring(path) .. "BTNDevotion.blp"
Icons.JudgementArmor = tostring(path) .. "BTNHoly Paladin.blp"
Icons.FireBlast = tostring(path) .. "BTNspell_fire_fireball.blp"
Icons.Scorch = tostring(path) .. "BTNSoulBurn.blp"
Icons.Pyroblast = tostring(path) .. "BTNSpell_Fire_Fireball02.blp"
Icons.Firestarter = tostring(path) .. "BTNspell_fire_playingwithfire.blp"
Icons.ImprovedScorch = tostring(path) .. "BTNSoulBurn.blp"
Icons.Ignite = tostring(path) .. "BTNIncinerate.blp"
Icons.Wildfire = tostring(path) .. "BTNability_mage_worldinflames.blp"
Icons.HotStreak = tostring(path) .. "BTNability_mage_hotstreak.blp"
Icons.Impact = tostring(path) .. "BTNWallOfFire.blp"
Icons.CriticalMass = tostring(path) .. "BTNability_mage_firestarter.blp"
Icons.Incinerate = tostring(path) .. "BTNIncinerateWoW.blp"
path = "Models/"
Models = {}
Models.name = "Models"
Models.__index = Models
Models.prototype = {}
Models.prototype.__index = Models.prototype
Models.prototype.constructor = Models
function Models.new(...)
    local self = setmetatable({}, Models.prototype)
    self:____constructor(...)
    return self
end
function Models.prototype.____constructor(self)
end
function Models.init(self)
end
Models.Rejuvenation = tostring(path) .. "GreenHealthSpinny20.mdl"
Models.Rejuvenation2 = tostring(path) .. "GreenHealthSpinny22.mdl"
Models.Swiftmend = tostring(path) .. "Green Light.mdl"
Models.Nourish = tostring(path) .. "Healing Surge_01.mdl"
Models.Tranquility = tostring(path) .. "AIreTarget_Green.mdl"
Models.Radiance = tostring(path) .. "Radiance Holy.mdl"
Models.HotStreak = tostring(path) .. "DoomTarget_01.mdl"
Models.HeatingUp = "Abilities/Spells/Orc/SpiritLink/SpiritLinkTarget.mdl"
Models.AirstrikeRocket = tostring(path) .. "Airstrike Rocket.mdl"
Models.FireCrescent = tostring(path) .. "Fire Crescent Tailed.mdl"
Models.SingularityOrange = "SingularityOrange.mdl"
Models.CorpseBomb = "CorpseBomb.mdl"
Models.HealingWave = "Abilities\\Spells\\Orc\\HealingWave\\HealingWaveTarget.mdl"
Models.MassTeleportDemon = "MassTeleportCasterDemon.mdl"
Models.ForceField = "ForceField.mdl"
Models.BloodExplosion = "BloodExplosion.mdl"
Models.CastDetermination = "DeterminationCastAnimMajor.mdl"
Models.CastRestoration = "HolyCastAnimMajor.mdl"
Models.CastRepentance = "RepentanceCastAnimCenteredScaledUp_00.mdl"
Models.CastSacrifice = "SacrificeCastAnimTall_09x170_extraphat.mdl"
Models.CastSummoningInstant = "MagicCircle_Demon.mdl"
Models.CastSummoning = "MagicCircle_DemonStand_03.mdl"
Models.CastShadow = "ShadowCast_02.mdl"
Models.CastUnholy = "UnholyCastAnim_03.mdx"
Models.CastNecromancy = "UnholyCastAnim_03.mdx"
Preload(Models.SingularityOrange)
Preload(Models.CorpseBomb)
Preload(Models.HealingWave)
Preload(Models.MassTeleportDemon)
Preload(Models.BloodExplosion)
Preload(Models.ForceField)
Preload(Models.CastDetermination)
Preload(Models.CastRestoration)
Preload(Models.CastRepentance)
Preload(Models.CastSacrifice)
Preload(Models.CastSummoningInstant)
Preload(Models.CastSummoning)
Preload(Models.CastShadow)
path = "ReplaceableTextures\\CommandButtons"
Textures = {}
Textures.name = "Textures"
Textures.__index = Textures
Textures.prototype = {}
Textures.prototype.__index = Textures.prototype
Textures.prototype.constructor = Textures
function Textures.new(...)
    local self = setmetatable({}, Textures.prototype)
    self:____constructor(...)
    return self
end
function Textures.prototype.____constructor(self)
end
function Textures.init(self)
end
Textures.BallBlue = tostring(path) .. "\\BTNBlueBall.mdl"
Textures.BallPurple = tostring(path) .. "\\BTNPurpleBall.mdl"
Textures.BallRed = tostring(path) .. "\\BTNRedBall.mdl"
Textures.BallWhite = tostring(path) .. "\\BTNWhiteBall.mdl"
Textures.BallSummoning = tostring(path) .. "\\BTNSummoningBall.blp"
Textures.DisBallBlue = tostring(path) .. "Disabled\\DISBTNBlueBall.blp"
Textures.DisBallPurple = tostring(path) .. "Disabled\\DISBTNPurpleBall.blp"
Textures.DisBallRed = tostring(path) .. "Disabled\\DISBTNRedBall.blp"
Textures.DisBallWhite = tostring(path) .. "Disabled\\DISBTNWhiteBall.blp"
Textures.DisBallSummoning = tostring(path) .. "Disabled\\DISBTNSummoningBall.blp"
