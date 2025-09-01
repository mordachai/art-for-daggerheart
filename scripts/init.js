/* -------------------------------------------
 * art-for-daggerheart — v13 Compendium Art integration
 * No compendium edits; supports spaces, wildcards, circle modes, and rings.
 * Dynamic system support based on module.json configuration.
 * ------------------------------------------- */

const MODULE_ID = "art-for-daggerheart";

const TOKEN_MODE = {
  WILDCARDS: "wildcards",
  WILDCARDS_RINGS: "wildcardsRings",
  CIRCLE: "circle",
  CIRCLE_RINGS: "circleRings",
  PORTRAIT_RINGS: "portraitRings"
};

// Cache for preloaded mapping data
let SUPPORTED_PACKS = new Set();
let MAPPING_DATA_LOADED = false;

function isWildcardMode(m) {
  return m === TOKEN_MODE.WILDCARDS || m === TOKEN_MODE.WILDCARDS_RINGS;
}
function hasRings(m) {
  return m === TOKEN_MODE.WILDCARDS_RINGS || m === TOKEN_MODE.CIRCLE_RINGS || m === TOKEN_MODE.PORTRAIT_RINGS;
}

/**
 * Preload all mapping files and cache supported pack collections
 * This runs during module initialization to avoid async issues during art application
 */
async function preloadMappingData() {
  const module = game.modules.get(MODULE_ID);
  const compendiumMappings = module?.flags?.compendiumArtMappings || {};
  
  SUPPORTED_PACKS.clear();
  
  debugLog("Preloading mapping data...");
  
  for (const [systemKey, config] of Object.entries(compendiumMappings)) {
    if (config?.mapping && typeof config.mapping === 'string') {
      try {
        debugLog(`Loading mapping file: ${config.mapping}`);
        const response = await fetch(config.mapping);
        if (response.ok) {
          const mappingData = await response.json();
          
          // Add all pack collection IDs from this mapping file to our supported set
          for (const packId of Object.keys(mappingData)) {
            SUPPORTED_PACKS.add(packId);
            debugLog(`Added supported pack: ${packId} (from ${systemKey})`);
          }
        } else {
          debugWarn(`Failed to fetch mapping file ${config.mapping}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        debugError(`Error loading mapping file ${config.mapping}:`, error);
      }
    }
  }
  
  MAPPING_DATA_LOADED = true;
  debugInfo(`Mapping data preloaded. Supported packs: ${Array.from(SUPPORTED_PACKS).join(', ')}`);
}

/**
 * Check if a pack collection is supported (synchronous after preload)
 * @param {string} packId - The pack collection ID to check
 * @returns {boolean} Whether this pack is supported
 */
function isPackSupported(packId) {
  if (!MAPPING_DATA_LOADED) {
    debugWarn(`Mapping data not yet loaded, but checking pack: ${packId}`);
    return false;
  }
  
  const supported = SUPPORTED_PACKS.has(packId);
  debugLog(`Pack ${packId} support check: ${supported}`);
  return supported;
}

/** Build token paths from a portrait like ".../portraits/<Name with spaces>.<ext>" */
function buildPathsFromActorImg(actorImg) {
  const m = /^(.*)\/portraits\/([^/]+)(\.[^.\/]+)$/.exec(actorImg);
  if (!m) return {};
  const [, root, baseName, ext] = m;
  const tokensDir = `${root}/tokens`;
  const circleDir = `${root}/circle`;
  const wildcardSrc = `${tokensDir}/${encodeURIComponent(baseName)}*${ext}`; // encode only filename for wildcard
  const circleSrc   = `${circleDir}/${baseName}${ext}`;                      // spaces OK
  return { wildcardSrc, circleSrc, ext };
}

/* ---------------- Debug helpers ---------------- */
function debugOn() { return game.settings.get(MODULE_ID, "debugLogging"); }
function debugLog(...args) { if (debugOn()) console.log(`[${MODULE_ID}]`, ...args); }
function debugInfo(...args) { if (debugOn()) console.info(`[${MODULE_ID}]`, ...args); }
function debugWarn(...args) { if (debugOn()) console.warn(`[${MODULE_ID}]`, ...args); }
function debugError(...args) { if (debugOn()) console.error(`[${MODULE_ID}]`, ...args); }
function debugNotify(message, type = "info") { if (debugOn()) ui.notifications?.[type](`[${MODULE_ID}] ${message}`); }

/* ---------------- Settings ---------------- */
function registerSettings() {
  game.settings.register(MODULE_ID, "tokenAutoRotate", {
    name: "Token Auto Rotate",
    hint: "If enabled, core token auto-rotation will be turned on for this world.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "debugLogging", {
    name: "Debug Logging",
    hint: "If enabled, the module will print detailed diagnostics to the console.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "ringColor", {
    name: "Token Ring Color",
    hint: "Choose the color for token rings when ring modes are enabled.",
    scope: "world",
    config: true,
    type: new foundry.data.fields.ColorField({}),
    default: "#8f0000",
    requiresReload: true,
    onChange: (value) => debugNotify(`Ring color updated to ${value}.`)
  });

  game.settings.register(MODULE_ID, "tokenMode", {
    name: "Token Mode",
    hint: "Select token source and style.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [TOKEN_MODE.WILDCARDS]: "Wildcards Only",
      [TOKEN_MODE.WILDCARDS_RINGS]: "Wildcards + Rings",
      [TOKEN_MODE.CIRCLE]: "Circle Only",
      [TOKEN_MODE.CIRCLE_RINGS]: "Circle + Rings",
      [TOKEN_MODE.PORTRAIT_RINGS]: "Portrait + Rings"
    },
    default: TOKEN_MODE.WILDCARDS_RINGS,
    requiresReload: true,
    onChange: (value) => debugNotify(`Token mode changed to ${value}.`)
  });

  game.settings.register(MODULE_ID, "tokenWidth", {
    name: "Token Width",
    hint: "Set the width for tokens (1.0 = normal size).",
    scope: "world",
    config: true,
    type: Number,
    default: 1.0,
    requiresReload: true,
    onChange: (value) => debugNotify(`Token width changed to ${value}.`)
  });

  game.settings.register(MODULE_ID, "tokenHeight", {
    name: "Token Height", 
    hint: "Set the height for tokens (1.0 = normal size).",
    scope: "world",
    config: true,
    type: Number,
    default: 1.0,
    requiresReload: true,
    onChange: (value) => debugNotify(`Token height changed to ${value}.`)
  });

  game.settings.register(MODULE_ID, "imageFitMode", {
    name: "Image Fit Mode",
    hint: "Choose how the token image should fit within the token frame.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "fill": "Fill",
      "contain": "Contain", 
      "cover": "Cover",
      "width": "Full Width",
      "height": "Full Height"
    },
    default: "contain",
    requiresReload: true,
    onChange: (value) => debugNotify(`Image fit mode changed to ${value}.`)
  });
}

/* ---------------- Core: apply compendium art ---------------- */
Hooks.on("applyCompendiumArt", (documentClass, source, pack, art) => {
  // Be tolerant to different pack shapes
  const packId = pack?.metadata?.id ?? pack?.collection;
  
  // Check if mapping data is loaded and if this pack is supported
  if (!MAPPING_DATA_LOADED) {
    debugWarn(`Mapping data not loaded yet for pack ${packId}. This should not happen if preload worked correctly.`);
    return;
  }
  
  if (!isPackSupported(packId)) {
    debugLog(`Pack ${packId} not supported, skipping`);
    return;
  }

  debugLog(`Processing compendium art for pack: ${packId}, actor: ${source.name}`);

  const mode = game.settings.get(MODULE_ID, "tokenMode");
  const tokenWidth = game.settings.get(MODULE_ID, "tokenWidth");
  const tokenHeight = game.settings.get(MODULE_ID, "tokenHeight");
  const imageFitMode = game.settings.get(MODULE_ID, "imageFitMode");

  // Normalize ring color (ColorField may return a Color object or a string)
  const rawRing = game.settings.get(MODULE_ID, "ringColor");
  const ringColor = (foundry?.utils?.Color?.from?.(rawRing)?.css) ?? String(rawRing);

  // Ensure token structure exists
  source.prototypeToken ??= {};
  source.prototypeToken.texture ??= {};
  source.prototypeToken.ring ??= { colors: {}, subject: {} };

  // 1) Portrait → token image (wildcards, circle, or portrait+rings)
  if (typeof art?.actor === "string" && art.actor) {
    source.img = art.actor;
    const { wildcardSrc, circleSrc } = buildPathsFromActorImg(art.actor);

    if (mode === TOKEN_MODE.PORTRAIT_RINGS) {
      // Use portrait directly with rings
      source.prototypeToken.texture.src = art.actor;
      source.prototypeToken.randomImg = false;
      debugLog(`Set portrait with rings: ${art.actor}`);
    } else if (isWildcardMode(mode) && wildcardSrc) {
      source.prototypeToken.texture.src = wildcardSrc; // e.g., ".../tokens/Cult%20Adept*.webp"
      source.prototypeToken.randomImg = true;
      debugLog(`Set wildcard token: ${wildcardSrc}`);
    } else if (circleSrc) {
      source.prototypeToken.texture.src = circleSrc;   // e.g., ".../circle/Cult Adept.webp"
      source.prototypeToken.randomImg = false;
      debugLog(`Set circle token: ${circleSrc}`);
    } else {
      // Fallback: use the portrait itself
      source.prototypeToken.texture.src = art.actor;
      source.prototypeToken.randomImg = false;
      debugLog(`Set fallback token (portrait): ${art.actor}`);
    }

    // Apply texture settings
    source.prototypeToken.width = tokenWidth;
    source.prototypeToken.height = tokenHeight;
    source.prototypeToken.texture.fit = imageFitMode;
  }

  // 2) Dynamic Token Ring
  const ringEnabled = hasRings(mode);
  source.prototypeToken.ring.enabled = ringEnabled;     // boolean
  source.prototypeToken.ring.effects = 1;
  source.prototypeToken.ring.colors.ring = ringEnabled ? ringColor : null;
  source.prototypeToken.ring.colors.background = null;
  source.prototypeToken.ring.subject.scale = ringEnabled ? 0.8 : 1.0;
  source.prototypeToken.ring.subject.texture = null;

  debugLog("CompendiumArt applied", {
    collection: packId,
    name: source.name,
    mode,
    img: source.img,
    tokenSrc: source.prototypeToken.texture?.src,
    width: source.prototypeToken.width,
    height: source.prototypeToken.height,
    fit: source.prototypeToken.texture?.fit,
    ringEnabled,
    ringColor,
    randomImg: source.prototypeToken.randomImg
  });
});

/* ---------------- Hooks: bootstrap ---------------- */
Hooks.once("init", () => {
  registerSettings();
  console.info(`[${MODULE_ID}] v13 Compendium Art integration initialized with dynamic system support.`);
});

Hooks.once("ready", async () => {
  // Preload mapping data first
  await preloadMappingData();
  
  const tokenAutoRotate = game.settings.get(MODULE_ID, "tokenAutoRotate");
  try { await game.settings.set("core", "tokenAutoRotate", tokenAutoRotate); }
  catch (err) { debugWarn("Could not set core.tokenAutoRotate", err); }
  
  // Log supported systems for debugging
  const module = game.modules.get(MODULE_ID);
  const compendiumMappings = module?.flags?.compendiumArtMappings || {};
  debugInfo("Configured systems:", Object.keys(compendiumMappings));
  debugInfo("Loaded supported packs:", Array.from(SUPPORTED_PACKS));
  
  debugInfo("Ready.");
});