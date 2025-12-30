/**
 * Art for Vagabond
 * Automatically applies artwork from Too Many Tokens Online to Vagabond NPCs
 */

let npcMapping = null;

// Base URL for Too Many Tokens DND repository
const TMT_BASE_URL = "https://raw.githubusercontent.com/IsThisMyRealName/too-many-tokens-dnd/main";

/**
 * Load the NPC mapping data on init
 */
Hooks.once("init", async () => {
  console.log("Art for Vagabond | Initializing...");

  try {
    const response = await fetch("modules/art-for-vagabond/npc-mapping.json");
    npcMapping = await response.json();
    console.log(`Art for Vagabond | Loaded ${Object.keys(npcMapping).length} NPC mappings`);
  } catch (error) {
    console.error("Art for Vagabond | Failed to load NPC mapping:", error);
  }
});

/**
 * Ready hook - confirm module is loaded
 */
Hooks.once("ready", () => {
  if (npcMapping) {
    console.log("Art for Vagabond | Ready! Artwork will be applied automatically to Vagabond NPCs.");
  } else {
    console.warn("Art for Vagabond | NPC mapping failed to load. Module may not function correctly.");
  }
});

/**
 * Apply artwork to compendium actors
 * This hook fires when Foundry applies art to actors from compendiums
 */
Hooks.on("applyCompendiumArt", (documentClass, source, pack, art) => {
  // Only process Actor documents
  if (documentClass.documentName !== "Actor") return;

  // Only process Vagabond system
  if (game.system.id !== "vagabond") return;

  // Only process Bestiary and Humanlike compendiums
  const packId = pack.metadata.id || pack.metadata.name;
  if (!packId.includes("bestiary") && !packId.includes("humanlike")) return;

  // Check if mapping is loaded
  if (!npcMapping) {
    console.warn("Art for Vagabond | NPC mapping not loaded yet");
    return;
  }

  // Get the actor name
  const actorName = source.name;
  if (!actorName) return;

  // Look up the mapping
  const mapping = npcMapping[actorName];
  if (!mapping) {
    console.debug(`Art for Vagabond | No mapping found for: ${actorName}`);
    return;
  }

  // Get the Too Many Tokens creature name
  const tmtCreature = mapping.tooManyTokens;
  if (!tmtCreature) return;

  // Construct the wildcard URL pattern
  // Example: https://raw.githubusercontent.com/IsThisMyRealName/too-many-tokens-dnd/main/Goblin*.webp
  const wildcardPath = `${TMT_BASE_URL}/${tmtCreature}*.webp`;

  // Apply the token artwork and settings
  art.prototypeToken = art.prototypeToken || {};
  art.prototypeToken.texture = art.prototypeToken.texture || {};

  // Set the wildcard token path
  art.prototypeToken.texture.src = wildcardPath;
  art.prototypeToken.randomImg = true; // Enable Foundry's native wildcard randomization

  // Apply size-based dimensions from mapping
  art.prototypeToken.width = mapping.width || 1;
  art.prototypeToken.height = mapping.height || 1;

  // Apply texture scaling
  art.prototypeToken.texture.scaleX = mapping.scaleX || 1;
  art.prototypeToken.texture.scaleY = mapping.scaleY || 1;

  console.log(`Art for Vagabond | Applied artwork for ${actorName} → ${tmtCreature} (${mapping.width}x${mapping.height})`);
});
