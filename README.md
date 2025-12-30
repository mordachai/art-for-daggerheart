# Art for Vagabond

Automatically applies token artwork from [Too Many Tokens Online](https://github.com/IsThisMyRealName/too-many-tokens-online) to Vagabond NPCs.

## Features

- **Automatic Token Application** - Tokens appear automatically when you open/create actors from compendiums
- **No Downloads Required** - Uses online URLs, keeping module size under 50KB
- **317 NPCs Mapped** - 99.7% coverage of Vagabond Bestiary and Humanlike compendiums
- **Size-Appropriate Scaling** - Automatically scales tokens based on creature size
  - Small/Medium: 1x1
  - Large: 2x2
  - Huge: 3x3
  - Giant: 4x4
  - Colossal: 6x6
- **Wildcard Token Randomization** - Multiple token variants for variety using Foundry's built-in wildcard support

## Installation

### Method 1: Manifest URL (Recommended)
1. Open Foundry VTT
2. Go to **Add-on Modules**
3. Click **Install Module**
4. Paste this URL in the **Manifest URL** field:
   ```
   https://github.com/mordachai/art-for-vagabond/releases/latest/download/module.json
   ```
5. Click **Install**

### Method 2: Manual Installation
1. Download the latest release
2. Extract to `Data/modules/art-for-vagabond`
3. Restart Foundry VTT

## Usage

1. **Enable the Module**
   - In your Vagabond world, go to **Settings** → **Manage Modules**
   - Enable "Art for Vagabond"
   - Click **Save Module Settings**

2. **It Just Works!**
   - Open any NPC from the Bestiary or Humanlike compendiums
   - Tokens are applied automatically
   - No configuration needed!

## How It Works

This module uses Foundry VTT v13's `applyCompendiumArt` hook to automatically apply artwork when actors are loaded from compendiums. It:

1. Maps Vagabond NPC names to equivalent creatures in Too Many Tokens DND
2. Constructs wildcard URLs pointing to online token images
3. Sets appropriate token dimensions based on creature size
4. Uses Foundry's native wildcard randomization for token variety

**Example Mappings:**
- `Ogler` → `Spectator`
- `Elemental, Water` → `Water Elemental`
- `Giant, Hill` → `Hill Giant`
- `Goblin, Mage` → `Goblin`

## Artwork Credits

All token artwork is from [Too Many Tokens Online](https://github.com/IsThisMyRealName/too-many-tokens-online) by [IsThisMyRealName](https://github.com/IsThisMyRealName).

This module simply provides mapping between Vagabond NPCs and the appropriate tokens from that collection.

## Requirements

- **Foundry VTT**: v12 or higher (verified on v13)
- **System**: Vagabond
- **Internet Connection**: Required to load token images from GitHub

## Technical Details

### Supported Compendiums
- `vagabond.bestiary` (297 creatures)
- `vagabond.humanlike` (21 NPCs)

### Module Size
- ~50KB total (mapping data only, no images)
- Images loaded on-demand from Too Many Tokens GitHub repository

### Vanilla Approach
This module follows Foundry VTT best practices:
- No complex scripts or overrides
- Uses native compendium art system
- Leverages built-in wildcard token support
- Simple hook-based implementation (~90 lines of JavaScript)

## FAQ

**Q: Do I need to download Too Many Tokens Online separately?**
A: No! This module uses direct URLs to the online token images.

**Q: Can I use this offline?**
A: No, an internet connection is required to load the token images.

**Q: What if a creature doesn't have a token?**
A: 99.7% of Vagabond NPCs are mapped. For the rare unmapped creature, the default Vagabond artwork is used.

**Q: Can I customize the mappings?**
A: Yes! Edit `npc-mapping.json` to change which Too Many Tokens creature is used for each Vagabond NPC.

**Q: Will this work with custom NPCs?**
A: Only NPCs from the official Vagabond Bestiary and Humanlike compendiums are mapped. Custom NPCs will use their default artwork.

## Development

### File Structure
```
art-for-vagabond/
├── module.json              # Module manifest
├── scripts/
│   └── init.js             # Main module code (~90 lines)
├── npc-mapping.json        # NPC → Too Many Tokens mappings (317 entries)
├── vagabond-npcs-data.json # Source data from Vagabond compendiums
└── README.md               # This file
```

### Regenerating Mappings

If you want to regenerate the mapping file:

1. Run `extract-vagabond-npcs.js` as a Foundry macro to extract current NPC data
2. Run `create-mapping.js` with Node.js to generate updated mappings
3. Review and adjust `npc-mapping.json` as needed

## Contributing

Found an issue or want to improve a mapping?

1. Open an issue or pull request at: https://github.com/mordachai/art-for-vagabond
2. Suggest better token matches for specific creatures
3. Report any bugs or compatibility issues

## License

This module is licensed under the MIT License. See LICENSE file for details.

Vagabond is a trademark of Indestructoboy.

Token artwork is from Too Many Tokens Online and subject to their licensing terms.

## Changelog

### v1.0.0 (2025-12-30)
- Initial release
- 317 NPCs mapped (99.7% coverage)
- Automatic token application via compendium art hooks
- Size-based token scaling
- Wildcard token randomization support