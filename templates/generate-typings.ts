import prettier from "prettier";
import fs from "node:fs/promises";

// Load the game sprite sheet. This needs to be extracted from the game's
// resource files, there are lots of free open source tools out there that do this.
import sprites from "./game.json" assert { type: "json" };

// Get all the sprite names
const spriteNames = Object.keys(sprites.sprites).map((name) => `"${name.slice(0, name.lastIndexOf("."))}"`);

// Create a typescript union type for all the sprite names
const typescriptSpriteNameType = `export type SpriteTemplateName = ${spriteNames.join(" | ")};\n`;

// Read the current file contents and replace the old types with the new type
const sourceFile = new URL("../src/image-operations/load-template.ts", import.meta.url);
const fileContents = await fs.readFile(sourceFile, { encoding: "ascii" });
const updatedFileContents = fileContents.replace(
    /export type SpriteTemplateName =\n[\s\w"/|-]+;\n/gm,
    typescriptSpriteNameType
);

// Format the source code with prettier before writing it back to the file
const prettierConfig = await prettier.resolveConfig(import.meta.url, { editorconfig: true });
const formattedFileContents = prettier.format(updatedFileContents, {
    parser: "typescript",
    ...prettierConfig,
    trailingComma: "es5",
});
await fs.writeFile(sourceFile, formattedFileContents);
