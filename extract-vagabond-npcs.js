/**
 * Foundry VTT Macro: Extract Vagabond NPC Data
 *
 * Instructions:
 * 1. Create a new macro in Foundry VTT
 * 2. Paste this code
 * 3. Run the macro
 * 4. Copy the output from the console
 * 5. Save to a JSON file
 */

(async () => {
  const results = {
    bestiary: [],
    humanlike: [],
    summary: {
      totalBestiary: 0,
      totalHumanlike: 0,
      sizes: {}
    }
  };

  // Extract from Bestiary
  const bestiaryPack = game.packs.get("vagabond.bestiary");
  if (bestiaryPack) {
    console.log("Extracting Bestiary compendium...");
    const bestiaryDocs = await bestiaryPack.getDocuments();

    for (const actor of bestiaryDocs) {
      const data = {
        id: actor.id,
        name: actor.name,
        img: actor.img,
        prototypeToken: {
          texture: {
            src: actor.prototypeToken?.texture?.src || actor.img,
            scaleX: actor.prototypeToken?.texture?.scaleX || 1,
            scaleY: actor.prototypeToken?.texture?.scaleY || 1
          },
          width: actor.prototypeToken?.width || 1,
          height: actor.prototypeToken?.height || 1
        },
        system: {
          size: actor.system?.size || "medium"
        }
      };

      results.bestiary.push(data);

      // Track size distribution
      const size = data.system.size;
      results.summary.sizes[size] = (results.summary.sizes[size] || 0) + 1;
    }

    results.summary.totalBestiary = results.bestiary.length;
    console.log(`Extracted ${results.bestiary.length} creatures from Bestiary`);
  } else {
    console.warn("Bestiary compendium not found!");
  }

  // Extract from Humanlike
  const humanlikePack = game.packs.get("vagabond.humanlike");
  if (humanlikePack) {
    console.log("Extracting Humanlike compendium...");
    const humanlikeDocs = await humanlikePack.getDocuments();

    for (const actor of humanlikeDocs) {
      const data = {
        id: actor.id,
        name: actor.name,
        img: actor.img,
        prototypeToken: {
          texture: {
            src: actor.prototypeToken?.texture?.src || actor.img,
            scaleX: actor.prototypeToken?.texture?.scaleX || 1,
            scaleY: actor.prototypeToken?.texture?.scaleY || 1
          },
          width: actor.prototypeToken?.width || 1,
          height: actor.prototypeToken?.height || 1
        },
        system: {
          size: actor.system?.size || "medium"
        }
      };

      results.humanlike.push(data);

      // Track size distribution
      const size = data.system.size;
      results.summary.sizes[size] = (results.summary.sizes[size] || 0) + 1;
    }

    results.summary.totalHumanlike = results.humanlike.length;
    console.log(`Extracted ${results.humanlike.length} NPCs from Humanlike`);
  } else {
    console.warn("Humanlike compendium not found!");
  }

  // Print summary
  console.log("\n=== EXTRACTION SUMMARY ===");
  console.log(`Total Bestiary creatures: ${results.summary.totalBestiary}`);
  console.log(`Total Humanlike NPCs: ${results.summary.totalHumanlike}`);
  console.log(`Total NPCs: ${results.summary.totalBestiary + results.summary.totalHumanlike}`);
  console.log("\nSize distribution:");
  for (const [size, count] of Object.entries(results.summary.sizes)) {
    console.log(`  ${size}: ${count}`);
  }

  // Print JSON output
  console.log("\n=== COPY THE JSON BELOW ===");
  console.log(JSON.stringify(results, null, 2));
  console.log("\n=== END JSON ===");

  // Also create a downloadable file
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vagabond-npcs-data.json';
  a.click();
  URL.revokeObjectURL(url);

  ui.notifications.info("NPC data extracted! Check console and downloads.");

  return results;
})();
