#!/usr/bin/env node
/**
 * Create comprehensive mapping from Vagabond NPCs to Too Many Tokens creatures
 * Handles Vagabond naming patterns and provides manual overrides
 */

const fs = require('fs');

// Read the Vagabond NPC data
const vagabondData = JSON.parse(fs.readFileSync('vagabond-npcs-data.json', 'utf8'));

// Too Many Tokens creature list
const tooManyTokensCreatures = [
  "Aarakocra", "Aboleth", "Abominable Yeti", "Acolyte", "Air Elemental", "Allosaurus",
  "Animated Armor", "Ankheg", "Ankylosaurus", "Ape", "Assassin", "Awakened Shrub",
  "Awakened Tree", "Axe Beak", "Azer", "Baboon", "Badger", "Bandit", "Bandit Captain",
  "Banshee", "Barbed Devil", "Barlgura", "Basilisk", "Bat", "Bearded Devil",
  "Beholder Zombie", "Berserker", "Black Bear", "Black Dragon Wyrmling", "Black Pudding",
  "Blink Dog", "Blood Hawk", "Blue Dragon Wyrmling", "Blue Slaad", "Boar", "Bone Devil",
  "Bone Naga", "Brass Dragon Wyrmling", "Bronze Dragon Wyrmling", "Brown Bear", "Bugbear",
  "Bugbear Chief", "Bulette", "Bullywug", "Cambion", "Camel", "Carrion Crawler", "Cat",
  "Cave Bear", "Centaur", "Chain Devil", "Chasme", "Chimera", "Chuul", "Clay Golem",
  "Cloaker", "Cloud Giant", "Cockatrice", "Commoner", "Constrictor Snake",
  "Copper Dragon Wyrmling", "Couatl", "Crab", "Crawling Claw", "Crocodile", "Cult Fanatic",
  "Cultist", "Cyclops", "Darkmantle", "Death Dog", "Death Slaad", "Deep Gnome", "Deer",
  "Deva", "Dire Wolf", "Displacer Beast", "Doppelganger", "Draft Horse", "Dretch",
  "Drider", "Drow", "Drow Elite Warrior", "Drow Mage", "Drow Priestess of Lolth", "Druid",
  "Dryad", "Duergar", "Duodrone", "Dust Mephit", "Eagle", "Earth Elemental", "Elephant",
  "Elk", "Ettercap", "Ettin", "Faerie Dragon", "Fire Elemental", "Fire Giant", "Fire Snake",
  "Flameskull", "Flesh Golem", "Flumph", "Flying Snake", "Flying Sword", "Fomorian", "Frog",
  "Frost Giant", "Galeb Duhr", "Gargoyle", "Gas Spore", "Gelatinous Cube", "Ghast", "Ghost",
  "Ghoul", "Giant Ape", "Giant Badger", "Giant Bat", "Giant Boar", "Giant Centipede",
  "Giant Constrictor Snake", "Giant Crab", "Giant Crocodile", "Giant Eagle", "Giant Elk",
  "Giant Fire Beetle", "Giant Frog", "Giant Goat", "Giant Hyena", "Giant Lizard",
  "Giant Octopus", "Giant Owl", "Giant Poisonous Snake", "Giant Rat", "Giant Scorpion",
  "Giant Seahorse", "Giant Shark", "Giant Spider", "Giant Toad", "Giant Vulture",
  "Giant Wasp", "Giant Weasel", "Giant Wolf Spider", "Gibbering Mouther", "Githyanki Knight",
  "Githyanki Warrior", "Githzerai Monk", "Githzerai Zerth", "Glabrezu", "Gladiator", "Gnoll",
  "Gnoll Fang of Yeenoghu", "Gnoll Pack Lord", "Goat", "Goblin", "Goblin Boss",
  "Gold Dragon Wyrmling", "Gorgon", "Gray Ooze", "Gray Slaad", "Green Dragon Wyrmling",
  "Green Hag", "Green Slaad", "Grell", "Griffon", "Grimlock", "Guard", "Guardian Naga",
  "Half-Ogre", "Harpy", "Hawk", "Hellhound", "Helmed Horror", "Hezrou", "Hill Giant",
  "Hippogriff", "Hobgoblin", "Hobgoblin Captain", "Hobgoblin Warlord", "Homunculus",
  "Hook Horror", "Hunter Shark", "Hydra", "Hyena", "Ice Mephit", "Imp", "Incubus",
  "Intellect Devourer", "Invisible Stalker", "Jackal", "Jackalwere", "Kenku", "Killer Whale",
  "Knight", "Kobold", "Kuo-toa", "Kuo-toa Archpriest", "Kuo-toa Monitor", "Kuo-toa Whip",
  "Lamia", "Lemure", "Lion", "Lizard", "Lizard King", "Lizard Queen", "Lizardfolk",
  "Lizardfolk Shaman", "Mage", "Magma Mephit", "Magmin", "Mammoth", "Manes", "Manticore",
  "Mastiff", "Medusa", "Merfolk", "Merrow", "Mezzoloth", "Mimic", "Mindflayer",
  "Mindflayer Arcanist", "Minotaur", "Minotaur Skeleton", "Monodrone", "Mud Mephit", "Mule",
  "Mummy", "Myconid Adult", "Myconid Sovereign", "Myconid Sprout", "Needle Blight",
  "Night Hag", "Nightmare", "Noble", "Nothic", "Nycaloth", "Ochre Jelly", "Octopus", "Ogre",
  "Ogre Zombie", "Oni", "Orc", "Orc Eye of Gruumsh", "Orc War Chief", "Orog", "Owl",
  "Owlbear", "Panther", "Pegasus", "Pentadrone", "Peryton", "Phase Spider", "Piercer",
  "Pixie", "Plesiosaurus", "Poisonous Snake", "Polar Bear", "Poltergeist", "Pony", "Priest",
  "Pseudodragon", "Pteranodon", "Quadrone", "Quaggoth", "Quaggoth Thonot", "Quasit",
  "Quipper", "Rat", "Raven", "Red Dragon Wyrmling", "Red Slaad", "Reef Shark", "Revenant",
  "Rhinoceros", "Riding Horse", "Roper", "Rug of Smothering", "Rust Monster",
  "Saber-Toothed Tiger", "Sahuagin", "Sahuagin Baron", "Sahuagin Priestess", "Salamander",
  "Satyr", "Scarecrow", "Scorpion", "Scout", "Sea Hag", "Sea Horse", "Shadow", "Shadow Demon",
  "Shambling Mound", "Shield Guardian", "Shrieker", "Silver Dragon Wyrmling", "Skeleton",
  "Slaad Tadpole", "Smoke Mephit", "Spectator", "Specter", "Spider", "Spined Devil",
  "Spirit Naga", "Sprite", "Steam Mephit", "Stirge", "Stone Giant", "Stone Golem", "Succubus",
  "Swarm of Bats", "Swarm of Beetles", "Swarm of Centipedes", "Swarm of Insects",
  "Swarm of Poisonous Snakes", "Swarm of Quippers", "Swarm of Rats", "Swarm of Ravens",
  "Swarm of Spiders", "Swarm of Wasps", "Thri-kreen", "Thug", "Tiger", "Treant",
  "Tribal Warrior", "Triceratops", "Tridrone", "Troglodyte", "Troll", "Twig Blight",
  "Tyrannosaurus Rex", "Umber Hulk", "Unicorn", "Vampire Spawn", "Veteran", "Vine Blight",
  "Violet Fungus", "Vrock", "Vulture", "Warhorse", "Warhorse Skeleton", "Water Elemental",
  "Water Weird", "Weasel", "Werebear", "Wereboar", "Wererat", "Weretiger", "Werewolf",
  "White Dragon Wyrmling", "Wight", "Will-o'-Wisp", "Winged Kobold", "Winter Wolf", "Wolf",
  "Worg", "Wraith", "Wyvern", "Yeti", "Yochol", "Young Black Dragon", "Young Blue Dragon",
  "Young Brass Dragon", "Young Bronze Dragon", "Young Copper Dragon", "Young Gold Dragon",
  "Young Green Dragon", "Young Red Dragon", "Young Remorhaz", "Young Silver Dragon",
  "Young White Dragon", "Yuan-ti Abomination", "Yuan-ti Malison (Type 1)",
  "Yuan-ti Malison (Type 3)", "Yuan-ti Pureblood", "Zombie"
];

// Create lookup map
const tmtMap = new Map();
tooManyTokensCreatures.forEach(creature => {
  tmtMap.set(creature.toLowerCase(), creature);
});

// Manual mappings for Vagabond-specific creatures and special cases
const manualMappings = {
  // Elementals (Vagabond uses "Elemental, Type" format)
  "Elemental, Air": "Air Elemental",
  "Elemental, Water": "Water Elemental",
  "Elemental, Fire": "Fire Elemental",
  "Elemental, Earth": "Earth Elemental",
  "Elemental, Lesser Air": "Air Elemental",
  "Elemental, Lesser Water": "Water Elemental",
  "Elemental, Lesser Fire": "Fire Elemental",
  "Elemental, Lesser Earth": "Earth Elemental",
  "Elemental, Greater Air": "Air Elemental",
  "Elemental, Greater Water": "Water Elemental",
  "Elemental, Greater Fire": "Fire Elemental",
  "Elemental, Greater Earth": "Earth Elemental",

  // Giants
  "Giant, Hill": "Hill Giant",
  "Giant, Stone": "Stone Giant",
  "Giant, Frost": "Frost Giant",
  "Giant, Fire": "Fire Giant",
  "Giant, Cloud": "Cloud Giant",

  // Golems
  "Golem, Bone": "Bone Naga", // Closest equivalent
  "Golem, Clay": "Clay Golem",
  "Golem, Flesh": "Flesh Golem",
  "Golem, Stone": "Stone Golem",
  "Golem, Iron": "Helmed Horror", // Visual equivalent

  // Goblins with variants
  "Goblin, Mage": "Goblin",
  "Goblin, Shaman": "Goblin",
  "Goblin, Alchemist": "Goblin",
  "Goblin, Tinkerer": "Goblin",
  "Goblin, King": "Goblin Boss",

  // Zombies and Skeletons with variants
  "Zombie, Drowner": "Zombie",
  "Zombie Dragon": "Beholder Zombie", // Large undead
  "Skeleton, Blazing Bones": "Skeleton",
  "Skeleton Warrior": "Skeleton",
  "Skeleton, Guardian": "Minotaur Skeleton",

  // Mages with elements
  "Mage, Fire": "Mage",
  "Mage, Frost": "Mage",
  "Mage, Shock": "Mage",

  // Dragons
  "Dragon, Ancient - Green": "Young Green Dragon",
  "Dragon, Ancient - Red": "Young Red Dragon",
  "Dragon, Ancient - Blue": "Young Blue Dragon",
  "Dragon, Ancient - Black": "Young Black Dragon",
  "Dragon, Ancient - White": "Young White Dragon",
  "Dragon, Young - Red": "Young Red Dragon",
  "Dragon, Young - Green": "Young Green Dragon",
  "Dragon, Young - Blue": "Young Blue Dragon",
  "Dragon, Young - Black": "Young Black Dragon",
  "Dragon, Young - White": "Young White Dragon",
  "Dragon Turtle": "Young Green Dragon", // Aquatic dragon substitute

  // Animals with Giant prefix (Vagabond uses suffix)
  "Ant, Giant": "Giant Centipede", // Closest
  "Bee, Giant": "Giant Wasp",
  "Beetle, Giant Fire": "Giant Fire Beetle",
  "Beetle, Giant Tiger": "Giant Fire Beetle",
  "Beetle, Bombardier": "Giant Fire Beetle",
  "Cat, Great": "Panther",
  "Leech, Giant": "Giant Worm", // Closest worm-like
  "Mantis, Giant": "Thri-kreen", // Insectoid
  "Rat, Giant": "Giant Rat",
  "Snake, Giant": "Giant Constrictor Snake",
  "Spider, Giant": "Giant Spider",
  "Weasel, Giant": "Giant Weasel",

  // Sharks
  "Shark": "Reef Shark",
  "Shark, Great White": "Hunter Shark",
  "Shark, Megalodon": "Hunter Shark",

  // Bears
  "Bear": "Brown Bear",
  "Bear, Grizzly": "Brown Bear",
  "Bear, Cave": "Cave Bear",

  // Wolves
  "Wolf": "Wolf",
  "Wolf, Dire": "Dire Wolf",
  "Wolf, Winter": "Winter Wolf",
  "Werewolf, Dire": "Werewolf",

  // Crocodiles/Alligators
  "Alligator/Crocodile": "Crocodile",
  "Alligator/Crocodile, Giant": "Giant Crocodile",

  // Oozes
  "Ooze, Ectoplasmic": "Gelatinous Cube",
  "Ooze, Gray": "Gray Ooze",
  "Ooze, Ochre": "Ochre Jelly",
  "Grasping Goo": "Gray Ooze",
  "Green Slime": "Ochre Jelly",

  // Special creatures
  "Flying Spellbook": "Flying Sword", // Flying object
  "Chort": "Bearded Devil", // Devil-like
  "Dimension Ripper": "Displacer Beast", // Dimensional creature
  "Nymit": "Sprite", // Small fey
  "Chicken": "Goat", // Small farm animal
  "Carcolh": "Purple Worm", // Giant worm-like
  "False Hydra": "Hydra",
  "Death Knight": "Knight",
  "Mummy Lord": "Mummy",
  "Sphinx, Archon": "Sphinx", // Generic sphinx
  "Deep One": "Kuo-toa", // Aquatic humanoid
  "Rabbit": "Goat", // Small animal
  "Lindworm": "Young Green Dragon", // Wingless dragon
  "Kelpie": "Nightmare", // Aquatic horse
  "Choker": "Intellect Devourer", // Small aberration

  // Boars
  "Boar, Giant": "Giant Boar",
  "Boar, Wild": "Boar",

  // Octopus
  "Octopus, Giant": "Giant Octopus",

  // Misc humanoids
  "Apothecary": "Commoner",
  "Trader": "Commoner",
  "Warlord": "Knight",
  "Bard": "Noble",

  // Additional mappings for creatures without direct equivalents
  "Agnar": "Yeti",
  "Agropelter": "Satyr",
  "Air Bubble": "Gas Spore",
  "Almiraj": "Giant Rat", // Horned rabbit
  "Amikuk": "Merrow", // Aquatic creature
  "Amphiptere": "Pseudodragon",
  "Angel": "Deva",
  "Assassin Vine": "Vine Blight",
  "Aurumvorax": "Badger", // Golden badger
  "Beisht Kione Dhoo": "Nightmare",
  "Brollachan": "Shadow",
  "Brownie": "Sprite",
  "Byakhee": "Vrock",
  "Carbuncle": "Pseudodragon",
  "Carcass Crawler": "Carrion Crawler",
  "Carrion Clump": "Shambling Mound",
  "Catoblepas": "Gorgon",
  "Cattle": "Goat",
  "Cave Fisher": "Hook Horror",
  "Crawling Wall": "Rug of Smothering",
  "Skeljaskrimsli": "Skeleton",

  // Additional common mappings
  "Will o' Wisp": "Will-o'-Wisp",
  "Owl Bear": "Owlbear",
  "Grey Ooze": "Gray Ooze",
  "Sabre-tooth Tiger": "Saber-Toothed Tiger",
  "Doppelgänger": "Doppelganger",

  // Hags
  "Hag, Grove": "Green Hag",
  "Hag, Sea": "Sea Hag",
  "Hag, Night": "Night Hag",

  // Kobolds
  "Kobold, Warrior": "Kobold",
  "Kobold, Alchemist": "Kobold",
  "Kobold, Winged": "Winged Kobold",

  // Goblins
  "Goblin, Warrior": "Goblin",

  // Skeletons
  "Skeleton, Giant": "Minotaur Skeleton",

  // Snakes
  "Snake, Pit Viper": "Poisonous Snake",
  "Snake, Giant Poisonous": "Giant Poisonous Snake",
  "Snake, Cobra": "Poisonous Snake",
  "Snake, Giant Constrictor": "Giant Constrictor Snake",

  // Apes
  "Ape, Giant": "Giant Ape",

  // Spiders
  "Spider, Giant Black Widow": "Giant Spider",
  "Spider, Giant Crab": "Giant Spider",
  "Spider, Phase": "Phase Spider",

  // Horses
  "Horse, Draft": "Draft Horse",
  "Horse, Riding": "Riding Horse",
  "Horse, War": "Warhorse",

  // Dragons
  "Dragon, Elder - Black": "Young Black Dragon",
  "Dragon, Elder - Red": "Young Red Dragon",
  "Dragon, Elder - Green": "Young Green Dragon",
  "Dragon, Elder - Blue": "Young Blue Dragon",
  "Dragon, Elder - White": "Young White Dragon",
  "Dragon, Hatchling - Red": "Red Dragon Wyrmling",
  "Dragon, Hatchling - Green": "Green Dragon Wyrmling",
  "Dragon, Hatchling - Blue": "Blue Dragon Wyrmling",
  "Dragon, Hatchling - Black": "Black Dragon Wyrmling",
  "Dragon, Hatchling - White": "White Dragon Wyrmling",

  // Centipedes
  "Centipede, Giant": "Giant Centipede",

  // Oozes
  "Ooze, Blood": "Ochre Jelly",

  // Misc creatures
  "Whale, Blue": "Killer Whale",
  "Sea Lion": "Seal", // Use seal-like
  "Hippopotamus": "Rhinoceros", // Similar bulk
  "Hippopotamus, Behemoth": "Rhinoceros",
  "Floating Eye": "Spectator", // Eye creature
  "Yellow Mould": "Shrieker", // Fungus
  "Lich": "Mummy", // Undead spellcaster
  "Froghemoth": "Chuul", // Aquatic aberration
  "Efreeti": "Fire Giant", // Fire genie
  "Living Statue, Rock": "Gargoyle",
  "Tarrasque": "Tyrannosaurus Rex", // Huge monster
  "Phoenix": "Fire Elemental", // Fire bird
  "Potead, Medium": "Awakened Shrub",
  "Potead, Small": "Awakened Shrub",

  // Obscure creatures - best guess mappings
  "Rumptifusel": "Goblin", // Mischievous creature
  "Thoom": "Earth Elemental", // Earth creature
  "Lizard, Giant Draco": "Giant Lizard",
  "Viskyd": "Sprite", // Small fey
  "Ripworm": "Purple Worm", // Worm creature
  "Joust Guardian": "Helmed Horror",
  "Demon Ray": "Chasme", // Flying demon
  "Hydrangean": "Treant", // Plant creature
  "Thulhan": "Aboleth", // Aberration
  "Church Grim": "Worg", // Spectral hound
  "Viper Tree": "Awakened Tree",
  "Jarjacha": "Death Dog",
  "Necrophidius": "Bone Naga",
  "Warp Beast": "Displacer Beast",

  // User-specified mappings
  "Ogler": "Spectator", // User said: "NPC does not have a Watcher, but it has an Ogler"

  // Remaining mappings
  "Hag, Green": "Green Hag",
  "Bat, Giant": "Giant Bat",
  "Scorpion, Giant": "Giant Scorpion",
  "Crab, Giant": "Giant Crab",
  "Frog/Toad, Giant": "Giant Frog",
  "Frog/Toad": "Frog",
  "Giant, Cyclops": "Cyclops",
  "Velociraptor": "Allosaurus",
  "Quetzalcoatlus": "Pteranodon",
  "Roc": "Giant Eagle",
  "Purple Worm": "Purple Worm", // Should exist but check
  "Otyugh": "Rust Monster", // Aberration
  "Electric Eel": "Giant Constrictor Snake",
  "Mermaid": "Merfolk",
  "Firebat": "Giant Bat",
  "Dethbat": "Giant Bat",
  "Mastodon": "Mammoth",
  "Kraken": "Giant Octopus",
  "Vampire": "Vampire Spawn",
  "Gremlin": "Imp",
  "Sphinx": "Sphinx", // Should exist
  "Dog, Medium": "Mastiff",
  "Dog, Small": "Jackal",
  "Questing Beast": "Chimera",
  "Drake": "Pseudodragon",
  "Hippocampus": "Sea Horse",
  "Lizard, Giant Gecko": "Giant Lizard",
  "Whale, Killer": "Killer Whale",
  "Pit Fiend": "Barbed Devil",
  "Nymph": "Dryad",
  "Brigand": "Bandit",

  // Spiders and insects
  "Spider, Giant Tarantella": "Giant Spider",
  "Slug, Giant": "Gray Ooze",
  "Rhagodessa": "Giant Spider",
  "Crayfish, Giant": "Giant Crab",

  // Oozes
  "Ooze, Quicksilver": "Gelatinous Cube",

  // Zombies
  "Zombie, Boomer": "Zombie",

  // Living Statues
  "Living Statue, Iron": "Helmed Horror",
  "Living Statue, Crystal": "Shield Guardian",

  // Demons
  "Stolas Demon": "Vrock",
  "Zotz, Demon": "Chasme",

  // Giants and colossal
  "Stone Colossus": "Stone Giant",
  "Thunderfoot": "Mammoth",

  // Goblins
  "Goblin, Archer": "Goblin",

  // Misc obscure creatures
  "Wolf in Sheep's Clothing": "Mimic",
  "Vigzud": "Troglodyte",
  "Dobar-Chú": "Displacer Beast",
  "Rot Grub": "Swarm of Beetles",
  "Magmot": "Magmin",
  "Dungeonheart": "Shambling Mound",
  "Potead, Large": "Awakened Tree",
  "Flail Snail": "Flumph",
  "Phorusrhacos": "Axe Beak",
  "Achaierai": "Axe Beak",
  "Snallygaster": "Cockatrice",
  "Hodag": "Bulette",
  "Vortex": "Air Elemental",
  "Snakeman": "Yuan-ti Pureblood",
  "Triffid": "Vine Blight",
  "Sea Serpent": "Plesiosaurus",
  "Grim Reaper": "Wraith",

  // Continue with more as needed...
};

// Size to scale mapping function
function getSizeScales(size) {
  const sizeMap = {
    'tiny': { width: 0.5, height: 0.5, scaleX: 1, scaleY: 1 },
    'small': { width: 1, height: 1, scaleX: 1, scaleY: 1 },
    'medium': { width: 1, height: 1, scaleX: 1, scaleY: 1 },
    'large': { width: 2, height: 2, scaleX: 1, scaleY: 1 },
    'huge': { width: 3, height: 3, scaleX: 1, scaleY: 1 },
    'giant': { width: 4, height: 4, scaleX: 1, scaleY: 1 },
    'gargantuan': { width: 4, height: 4, scaleX: 1, scaleY: 1 },
    'colossal': { width: 6, height: 6, scaleX: 1, scaleY: 1 }
  };
  return sizeMap[size.toLowerCase()] || sizeMap['medium'];
}

// Process all NPCs
const allNPCs = [...vagabondData.bestiary, ...vagabondData.humanlike];
const finalMapping = {};
const unmapped = [];

allNPCs.forEach(npc => {
  const vagabondName = npc.name;
  let tmtCreature = null;

  // Check manual mapping first
  if (manualMappings[vagabondName]) {
    tmtCreature = manualMappings[vagabondName];
  } else {
    // Try exact match
    if (tmtMap.has(vagabondName.toLowerCase())) {
      tmtCreature = tmtMap.get(vagabondName.toLowerCase());
    }
  }

  if (tmtCreature) {
    const scales = getSizeScales(npc.system.size);
    finalMapping[vagabondName] = {
      tooManyTokens: tmtCreature,
      size: npc.system.size,
      width: scales.width,
      height: scales.height,
      scaleX: scales.scaleX,
      scaleY: scales.scaleY
    };
  } else {
    unmapped.push({
      name: vagabondName,
      size: npc.system.size
    });
  }
});

// Write final mapping
fs.writeFileSync('npc-mapping.json', JSON.stringify(finalMapping, null, 2));

// Write unmapped list
fs.writeFileSync('unmapped-npcs.json', JSON.stringify(unmapped, null, 2));

// Summary
console.log('\n=== FINAL MAPPING SUMMARY ===\n');
console.log(`Total NPCs: ${allNPCs.length}`);
console.log(`Mapped: ${Object.keys(finalMapping).length}`);
console.log(`Unmapped: ${unmapped.length}`);
console.log(`\nCoverage: ${(Object.keys(finalMapping).length / allNPCs.length * 100).toFixed(1)}%`);

if (unmapped.length > 0) {
  console.log('\n=== UNMAPPED NPCs (need manual review) ===');
  unmapped.slice(0, 20).forEach(npc => {
    console.log(`  - ${npc.name} (${npc.size})`);
  });
  if (unmapped.length > 20) {
    console.log(`  ... and ${unmapped.length - 20} more`);
  }
}

console.log('\n=== FILES GENERATED ===');
console.log('npc-mapping.json - Final NPC to TMT mapping with scales');
console.log('unmapped-npcs.json - List of unmapped NPCs for manual review');
