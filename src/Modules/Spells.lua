local ____exports = {}
local ____SummonMelee = require("Spells.Paladin.SummonMelee")
local SummonMelee = ____SummonMelee.SummonMelee
local ____SummonRanged = require("Spells.Paladin.SummonRanged")
local SummonRanged = ____SummonRanged.SummonRanged
local ____Rejuvenate = require("Spells.Paladin.Rejuvenate")
local Rejuvenate = ____Rejuvenate.Rejuvenate
local ____SpellHelper = require("Global.SpellHelper")
local SpellHelper = ____SpellHelper.SpellHelper
local ____Bless = require("Spells.Paladin.Bless")
local Bless = ____Bless.Bless
local ____Purge = require("Spells.Paladin.Purge")
local Purge = ____Purge.Purge
local ____Invigorate = require("Spells.Paladin.Invigorate")
local Invigorate = ____Invigorate.Invigorate
local ____Endure = require("Spells.Paladin.Endure")
local Endure = ____Endure.Endure
local ____Justice = require("Spells.Paladin.Justice")
local Justice = ____Justice.Justice
local ____SummonEvilOutsider = require("Spells.Warlock.SummonEvilOutsider")
local SummonEvilOutsider = ____SummonEvilOutsider.SummonEvilOutsider
local ____DemonismShadowcraft = require("Spells.Warlock.DemonismShadowcraft")
local DemonismShadowcraft = ____DemonismShadowcraft.DemonismShadowcraft
local ____Taint = require("Spells.Warlock.Taint")
local Taint = ____Taint.Taint
local ____CrazyImp = require("Spells.Warlock.CrazyImp")
local CrazyImp = ____CrazyImp.CrazyImp
local ____ContagiousInsanity = require("Spells.Warlock.ContagiousInsanity")
local ContagiousInsanity = ____ContagiousInsanity.ContagiousInsanity
local ____RitualOfDeath = require("Spells.Warlock.RitualOfDeath")
local RitualOfDeath = ____RitualOfDeath.RitualOfDeath
local ____DarkPortal = require("Spells.Warlock.DarkPortal")
local DarkPortal = ____DarkPortal.DarkPortal
local ____StealEssence = require("Spells.Warlock.StealEssence")
local StealEssence = ____StealEssence.StealEssence
local ____WhitePower = require("Spells.Paladin.WhitePower")
local WhitePower = ____WhitePower.WhitePower
local ____DarkPower = require("Spells.Warlock.DarkPower")
local DarkPower = ____DarkPower.DarkPower
local ____SacrificeMastery = require("Spells.Warlock.SacrificeMastery")
local SacrificeMastery = ____SacrificeMastery.SacrificeMastery
local ____Perseverance = require("Spells.Paladin.Perseverance")
local Perseverance = ____Perseverance.Perseverance
local ____Redemption = require("Spells.Paladin.Redemption")
local Redemption = ____Redemption.Redemption
local ____GuardianAngel = require("Spells.Paladin.GuardianAngel")
local GuardianAngel = ____GuardianAngel.GuardianAngel
local ____Exorcism = require("Spells.Paladin.Exorcism")
local Exorcism = ____Exorcism.Exorcism
local ____CallSuccubus = require("Spells.Warlock.CallSuccubus")
local CallSuccubus = ____CallSuccubus.CallSuccubus
local ____BloodFeast = require("Spells.Warlock.BloodFeast")
local BloodFeast = ____BloodFeast.BloodFeast
local ____Paranoia = require("Spells.Warlock.Paranoia")
local Paranoia = ____Paranoia.Paranoia
local ____AntimagicZone = require("Spells.DeathKnight.AntimagicZone")
local AntimagicZone = ____AntimagicZone.AntimagicZone
local ____VolatileLeeches = require("Spells.DeathKnight.VolatileLeeches")
local VolatileLeeches = ____VolatileLeeches.VolatileLeeches
local ____DeathVolley = require("Spells.DeathKnight.DeathVolley")
local DeathVolley = ____DeathVolley.DeathVolley
local ____SummonGhoul = require("Spells.DeathKnight.SummonGhoul")
local SummonGhoul = ____SummonGhoul.SummonGhoul
local ____SummonAbomination = require("Spells.DeathKnight.SummonAbomination")
local SummonAbomination = ____SummonAbomination.SummonAbomination
local ____DeathsEmbrace = require("Spells.DeathKnight.DeathsEmbrace")
local DeathsEmbrace = ____DeathsEmbrace.DeathsEmbrace
local ____CorruptedBlood = require("Spells.DeathKnight.CorruptedBlood")
local CorruptedBlood = ____CorruptedBlood.CorruptedBlood
local ____DeathAndDecay = require("Spells.DeathKnight.DeathAndDecay")
local DeathAndDecay = ____DeathAndDecay.DeathAndDecay
local ____VampiresBoon = require("Spells.DeathKnight.VampiresBoon")
local VampiresBoon = ____VampiresBoon.VampiresBoon
local ____UnholyCurse = require("Spells.DeathKnight.UnholyCurse")
local UnholyCurse = ____UnholyCurse.UnholyCurse
local ____ArmyOfTheDead = require("Spells.DeathKnight.ArmyOfTheDead")
local ArmyOfTheDead = ____ArmyOfTheDead.ArmyOfTheDead
local ____RedPower = require("Spells.DeathKnight.RedPower")
local RedPower = ____RedPower.RedPower
require("Config")
function ____exports.InitializeSpells()
    WhitePower:init(Spells.WhitePower)
    SummonMelee:init(Spells.SummonMelee)
    SummonRanged:init(Spells.SummonRanged)
    Perseverance:init(Spells.Perseverance)
    Rejuvenate:init(Spells.Rejuvenate, Buffs.CorruptedBlood, Models.CastRestoration)
    Bless:init(Spells.Bless)
    Purge:init(Spells.Purge)
    Invigorate:init(Spells.Invigorate)
    Endure:init(Spells.Endure)
    Justice:init(Spells.Justice)
    Redemption:init(Spells.Redemption)
    GuardianAngel:init(Spells.GuardianAngel)
    Exorcism:init(Spells.Exorcism)
    DarkPower:init(Spells.DarkPower)
    SummonEvilOutsider:init(Spells.SummonEvilOutsider)
    DemonismShadowcraft:init(Spells.DemonismShadowcraft)
    SacrificeMastery:init(Spells.SacrificeMastery)
    Taint:init(Spells.Taint)
    CrazyImp:init(Spells.CrazyImp)
    ContagiousInsanity:init(Spells.ContagiousInsanity)
    RitualOfDeath:init(Spells.RitualOfDeath)
    DarkPortal:init(Spells.DarkPortal)
    StealEssence:init(Spells.StealEssence)
    BloodFeast:init(Spells.BloodFeast)
    CallSuccubus:init(Spells.CallSuccubus)
    Paranoia:init(Spells.Paranoia)
    RedPower:init(Spells.RedPower)
    SummonGhoul:init(Spells.SummonGhoul)
    SummonAbomination:init(Spells.SummonAbomination)
    VolatileLeeches:init(Spells.VolatileLeeches)
    DeathVolley:init(Spells.DeathVolley)
    CorruptedBlood:init(Spells.CorruptedBlood)
    DeathsEmbrace:init(Spells.DeathsEmbrace)
    AntimagicZone:init(Spells.AntimagicZone)
    DeathAndDecay:init(Spells.DeathAndDecay)
    VampiresBoon:init(Spells.VampiresBoon)
    UnholyCurse:init(Spells.UnholyCurse)
    ArmyOfTheDead:init(Spells.ArmyOfTheDead)
end
function ____exports.PreloadSpells()
    SpellHelper:Preload(Spells.Rejuvenate)
    SpellHelper:Preload(Spells.SummonMelee)
    SpellHelper:Preload(Spells.SummonRanged)
    SpellHelper:Preload(Spells.WhitePower)
    SpellHelper:Preload(Spells.Bless)
    SpellHelper:Preload(Spells.Purge)
    SpellHelper:Preload(Spells.Invigorate)
    SpellHelper:Preload(Spells.Endure)
    SpellHelper:Preload(Spells.Justice)
    SpellHelper:Preload(Spells.Redemption)
    SpellHelper:Preload(Spells.GuardianAngel)
    SpellHelper:Preload(Spells.Exorcism)
    SpellHelper:Preload(Spells.SummonEvilOutsider)
    SpellHelper:Preload(Spells.DemonismShadowcraft)
    SpellHelper:Preload(Spells.Taint)
    SpellHelper:Preload(Spells.CrazyImp)
    SpellHelper:Preload(Spells.ContagiousInsanity)
    SpellHelper:Preload(Spells.RitualOfDeath)
    SpellHelper:Preload(Spells.DarkPortal)
    SpellHelper:Preload(Spells.StealEssence)
    SpellHelper:Preload(Spells.BloodFeast)
    SpellHelper:Preload(Spells.CallSuccubus)
    SpellHelper:Preload(Spells.AntimagicZone)
    SpellHelper:Preload(Spells.VolatileLeeches)
    SpellHelper:Preload(Spells.DeathVolley)
    SpellHelper:Preload(Spells.DeathsEmbrace)
    SpellHelper:Preload(Spells.CorruptedBlood)
    SpellHelper:Preload(Spells.DeathAndDecay)
    SpellHelper:Preload(Spells.VampiresBoon)
    SpellHelper:Preload(Spells.UnholyCurse)
    SpellHelper:Preload(Spells.ArmyOfTheDead)
    SpellHelper:Preload(Auras.BloodFeastDamageBonus)
    SpellHelper:Preload(Auras.BloodFeastHpBonus)
    SpellHelper:Preload(Auras.AmzSpellImmunity)
    SpellHelper:Preload(Auras.VampiresBoon)
    SpellHelper:Preload(Auras.ArmyOfTheDead)
    SpellHelper:Preload(Dummies.AntimagicZone)
    SpellHelper:Preload(Dummies.DeathVolley)
    SpellHelper:Preload(Dummies.CorruptedBlood)
    SpellHelper:Preload(Dummies.DeathAndDecay)
    SpellHelper:Preload(Auras.VolatileLeechesBites)
    SpellHelper:ExecuteSpellPreload()
end
return ____exports
