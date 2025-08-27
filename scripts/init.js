/* -------------------------------------------
 * art-for-daggerheart — v13 Compendium Art integration
 * No compendium edits; supports spaces, wildcards, circle modes, and rings.
 * ------------------------------------------- */

const MODULE_ID = "art-for-daggerheart";
const ADV_PACK = "daggerheart.adversaries";
const ADV_PACK_UO = "daggerheart-unofficial-srd.adversaries";

const TOKEN_MODE = {
  WILDCARDS: "wildcards",
  WILDCARDS_RINGS: "wildcardsRings",
  CIRCLE: "circle",
  CIRCLE_RINGS: "circleRings"
};

function isWildcardMode(m) {
  return m === TOKEN_MODE.WILDCARDS || m === TOKEN_MODE.WILDCARDS_RINGS;
}
function hasRings(m) {
  return m === TOKEN_MODE.WILDCARDS_RINGS || m === TOKEN_MODE.CIRCLE_RINGS;
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
    default: true
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
      [TOKEN_MODE.CIRCLE_RINGS]: "Circle + Rings"
    },
    default: TOKEN_MODE.WILDCARDS_RINGS,
    requiresReload: true,
    onChange: (value) => debugNotify(`Token mode changed to ${value}.`)
  });
}

/* ---------------- Core: apply compendium art ---------------- */
Hooks.on("applyCompendiumArt", (documentClass, source, pack, art) => {
  // Be tolerant to different pack shapes
  const packId = pack?.metadata?.id ?? pack?.collection;
  if (packId !== ADV_PACK && packId !== ADV_PACK_UO) return;

  const mode = game.settings.get(MODULE_ID, "tokenMode");

  // Normalize ring color (ColorField may return a Color object or a string)
  const rawRing = game.settings.get(MODULE_ID, "ringColor");
  const ringColor = (foundry?.utils?.Color?.from?.(rawRing)?.css) ?? String(rawRing);

  // Ensure token structure exists
  source.prototypeToken ??= {};
  source.prototypeToken.texture ??= {};
  source.prototypeToken.ring ??= { colors: {}, subject: {} };

  // 1) Portrait → token image (wildcards or circle)
  if (typeof art?.actor === "string" && art.actor) {
    source.img = art.actor;
    const { wildcardSrc, circleSrc } = buildPathsFromActorImg(art.actor);

    if (isWildcardMode(mode) && wildcardSrc) {
      source.prototypeToken.texture.src = wildcardSrc; // e.g., ".../tokens/Cult%20Adept*.webp"
      source.prototypeToken.randomImg = true;
    } else if (circleSrc) {
      source.prototypeToken.texture.src = circleSrc;   // e.g., ".../circle/Cult Adept.webp"
      source.prototypeToken.randomImg = false;
    } else {
      // Fallback: use the portrait itself
      source.prototypeToken.texture.src = art.actor;
      source.prototypeToken.randomImg = false;
    }
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
    ringEnabled,
    ringColor
  });
});

/* ---------------- Hooks: bootstrap ---------------- */
Hooks.once("init", () => {
  registerSettings();
  console.info(`[${MODULE_ID}] v13 Compendium Art integration initialized.`);
});

Hooks.once("ready", async () => {
  const tokenAutoRotate = game.settings.get(MODULE_ID, "tokenAutoRotate");
  try { await game.settings.set("core", "tokenAutoRotate", tokenAutoRotate); }
  catch (err) { debugWarn("Could not set core.tokenAutoRotate", err); }
  debugInfo("Ready.");
});
