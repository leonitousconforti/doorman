/* eslint-disable @typescript-eslint/no-non-null-assertion */

import sharp from "sharp";
import path from "node:url";
import { Image, imageTypeFromChannelsForPng } from "../../src/image-operations/image.js";

// Loads a png using sharp and converts it to a image that the image operations can use
export const loadPng = async (file: URL): Promise<Image> => {
    const png = sharp(path.fileURLToPath(file)).raw();
    const pngMetadata = await png.metadata();

    return {
        width: pngMetadata.width!,
        height: pngMetadata.height!,
        channels: pngMetadata.channels! as 1 | 2 | 3 | 4,
        format: imageTypeFromChannelsForPng(pngMetadata.channels!),
        pixels: await png.toBuffer(),
    };
};
