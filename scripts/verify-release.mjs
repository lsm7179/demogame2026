import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const packageMetadata = await readJson(new URL("../package.json", import.meta.url));
const gameMetadata = await readJson(new URL("../echo-breach/version.json", import.meta.url));
const manifest = await readJson(new URL("../echo-breach/manifest.webmanifest", import.meta.url));
const gameSource = await readFile(new URL("../echo-breach/game.js", import.meta.url), "utf8");
const pagesWorkflow = await readFile(
  new URL("../.github/workflows/pages.yml", import.meta.url),
  "utf8"
);

assert.match(gameMetadata.version, /^\d+\.\d+\.\d+$/u, "game version must use SemVer");
assert.equal(packageMetadata.version, gameMetadata.version, "package and game versions must match");
assert.equal(manifest.name, gameMetadata.name, "manifest and game names must match");
assert.match(
  gameSource,
  new RegExp(`SAVE_VERSION\\s*=\\s*${gameMetadata.saveSchemaVersion};`),
  "version metadata must match the localStorage schema"
);
assert.match(pagesWorkflow, /path:\s*echo-breach/u, "Pages must deploy echo-breach only");

console.log(
  `release metadata verified: ${gameMetadata.name} v${gameMetadata.version}, save schema ${gameMetadata.saveSchemaVersion}`
);
