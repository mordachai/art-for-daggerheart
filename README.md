### Current Progress (Adversaries):

![Progress](https://progress-bar.xyz/94/?style=for-the-badge&scale=129&title=Core_Adversaries&width=1000&color=babaca&prefix=&suffix=/129)

> Work in progress!
> We’re building up a full set of portraits and varied tokens for all adversaries.
> Some tokens might have just 3 variants, others can have 10 or more.
> There’s no “right” number — the important thing is to have at least a few for variety, and usually you’ll see 3–4 per adversary.

![Static Badge](https://img.shields.io/badge/Foundry_VTT-13-blue?style=for-the-badge) ![Github All Releases](https://img.shields.io/github/downloads/mordachai/art-for-daggerheart/total.svg?style=for-the-badge) ![GitHub Release](https://img.shields.io/github/v/release/mordachai/art-for-daggerheart?display_name=release&style=for-the-badge&label=Current%20version)



---

# Art for Daggerheart


Art for Daggerheart is a Foundry VTT module that drops fresh, custom-made art straight into your Daggerheart game.
We’re talking unique portraits and tokens for all the adversaries — all AI-generated just for this module.

You get to pick if you want dynamic wildcard tokens that change each time they hit the map, or clean circular tokens for a sharper look.
And if you want extra style, you can add the built-in Foundry Token Rings around them for that “pop” factor.

<img width="1552" height="934" alt="image" src="https://github.com/user-attachments/assets/1f6fca88-9c88-409c-81f3-234c0ecc724e" />

---

## Features

* Unique portraits for every adversary.
* Dynamic wildcard tokens for variety in-game.
* Circular tokens with a clean, masked look.
* Optional Foundry Token Rings for extra flair.
* Automatically updates the Daggerheart adversaries compendium when the world loads.
* All art is original and made for this module.

---

## Token Modes

Choose your look in the module settings:

<img width="797" height="700" alt="image" src="https://github.com/user-attachments/assets/e913c647-4584-44fb-b2e7-b02178301f21" />

* **Wildcards Only** – Varied tokens from the `tokens/` folder.
* **Wildcards + Rings** – Varied tokens plus Foundry’s built-in rings.
* **Circle Only** – Circular tokens from the `circle/` folder.
* **Circle + Rings** – Circular tokens plus Foundry’s built-in rings.

<img width="1434" height="771" alt="image" src="https://github.com/user-attachments/assets/084f1980-3585-4f41-937b-28a89589fa7a" />

---

## Installation

### Manual Install (until v1.0)

1. Go to **Add-on Modules** in Foundry VTT, **Install Module** and paste this manifest URL in the bottom input:

   ```   
   https://github.com/mordachai/art-for-daggerheart/raw/main/module.json
   ```
---

## How It Works

When you start the world, the module checks the **Daggerheart adversaries compendium** and updates each adversary’s portrait and token based on your chosen **Token Mode**.
If Rings are turned on, it applies Foundry’s own Token Rings with the preset style from the module.

---

## Developer Notes

* **`portraits/`** – Portrait images for adversary sheets.
* **`tokens/`** – Wildcard token images with multiple variations.
* **`circle/`** – Circular-masked token images, based on the portraits.
* Matches images to actors by name, ignoring case, accents, and numbering.
* Wildcard mode uses Foundry’s built-in random token selection.
* Ring modes use Foundry’s built-in Token Rings feature with preset colors and scale.

---

## Changelog

See [CHANGELOG](CHANGELOG.md)

---

## License

The images are done using AI. So, they are under https://creativecommons.org/publicdomain/zero/1.0/ 
