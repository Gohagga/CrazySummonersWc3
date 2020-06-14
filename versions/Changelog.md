## Version 0.53e

### Main Changes
- Reworked the requirement system, now it works despite bug introduced by 1.32
- Increased cooldown time of non-Summoning orbs from 20 to 35
- Increased rate of Red Power, White Power and Dark Power stacks accumulation by 20%, and raised max stack limit from 30 to 50
- Lowered maximum lumber gained until lvl 19 from 7 to 6.
- Added a simple AI. Starting a game with a computer slot will have it select a paladin at "-start" command.
    AI's strategy is solely spawning minions in bulk and maxing out Summoning orbs. (it's super hard to play against)

### Fixes
- Summon Abomination 10 was spawning a lvl 1 unit
- Orb cost said in tooltip, its disabling requirement and actual consumption were not the same for some abilities
- Tooltips (mostly orb costs)

### Misc
- Add Death Knight's Necromancy spells cast animation
- Added Map preview

## Version 0.53

### Main Changes
- Removed manacost of all spells and Summon skills, plan to use mana for "super" spells.
- All classes will now have 100 max mana and regen 1 mps, and start the game with 0 mana.
- Added +1 lumber at lvl 19 for all classes, for a total of 7 lumber 1-19.
- Added 3 "super" abilities to Paladin and Warlock. These cost mana and become available after level 10.
- Added Death Knight class with 9 spells, 2 summons and anti magic

### Fixes
- There was a bug in Max Orb limit
- Steal Essence's AoE was inconsistent with the targeting image size
- Tooltips

### Class Changes
- Increased Warlock's Steal Essence orb to 2 Purple + Red + Blue from Purple + Red + Blue
- Warlock's Ritual of Death changed to following:
    Suffer 1 damage to deal magic damage to an enemy unit equal to its max hp. Has 10/15/20/25% chance to negate the life cost. Costs 2 Purple + 1 Red
- Added new levelable ability to Paladin - Perseverance:
    Grants a friendly hero +1 maximum hp, up to 35-40 max hp. If the hero has 35-40 max hp or more, it heals by 2 instead. Damages undead (like Death Knight)
- Reduced AoE scaling of these spells: Bless and Endure from 750 to 550, Purge 300-750 to 350-500, Taint 250-700 to 250-550,
- Added spells Redemption, Guardian Angel and Exorcism to Paladin.
- Paladin's Rejuvenate doesn't heal magic immune units anymore.

### Quality of life changes
- Hero selector is selected for each player on game start
- Leveling up abilities shouldn't interrupt spellcasting anymore.

### Misc
- Update Warlock's cast animation
- Updated Hero Proper names


## Version 0.52a

### Main Changes:
- Added a "Summoning" Orb type, used for summon skills, general rule is 1 summon orb = 1 unit worth of power on battlefield
- Summon Melee, Ranged and Evil Outsider now cost 1, 1 and 2 Summoning orbs respectively
- Summon Orbs are visually placed on a row on top of other colors, for easier distinguishing.
- Summon Orbs can be bought via lumber, but they cost 2 lumber instead of 1, and you can have max 6 of them (as opposed to regular orbs who have limit 12)
- Paladin and Warlock now each receive 3 Summon orbs after hero select
- Properly implemented hero-reselection and game state reset. This allows for multiple "rounds" within a single game
- Added "-end" command to red player which stops and resets passive exp gain, allowing for a re "-start"

### Fixes
- choosing a paladin mastery after taking points in "Paladin Mastery"
- infinite casting times due to an index out of range
- tooltips on lots of stuff
- Paladin's Endure wasn't doing anything
- Ritual of Death's target animation would not disappear on skill cancel
- Lots of spells lvl 1 casting times' were skipped so now most of spells have a tiny bit longer casting time at lvl 1
- Wrong casting animations on spells due to copy paste :'D

### Class Changes
- Paladin now receives 3 White orbs and 1 lumber at hero select
- Warlock now receives 2 Purple and 1 Red orb at hero select
- Warlock's Crazy Imp now costs 1 Purple + 1 Summoning
- Warlock's Dark Portal now costs 2 Purple + 1 Red + 1 Summoning
- Warlock now has an ability "Sacrifice Mastery". Adding points to it will increase lvl of all Sacrifice spells

### Quality of life changes
- Switched spell orb cost consumption to after finish casting instead of at the start of casting the spell
- Added tooltips to the orbs, for now they just show their name "Blue Orb", "White Orb", "Summoning Orb" - Thought it might be easier to understand the game for new ppl (especially Summon orb)
- The bonus orbs are for faster game start and so new players can have spells available at start