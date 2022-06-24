import { Image } from "./image.js";

// Defines a region to crop
export type CropRegion = {
    top: number;
    left: number;
    width: number;
    height: number;
};

// Crops an image to the area defined by the given region
export const cropImage = (sourceImage: Image, region: CropRegion): Image => {
    // Region out of bounds errors
    if (region.top < 0 || region.top + region.height > sourceImage.height) {
        throw new Error("Invalid crop region, region extends beyond the images height");
    }
    if (region.left < 0 || region.left + region.width > sourceImage.width) {
        throw new Error("Invalid crop region, region extends beyond the images width");
    }

    // Create a new image with the same number of channels and format, the region's
    // width, the region's height, and the correct pixel buffer size.
    const croppedImage: Image = {
        channels: sourceImage.channels,
        width: region.width,
        height: region.height,
        format: sourceImage.format,
        pixels: Buffer.alloc(region.width * region.height * sourceImage.channels),
    };

    // Shortcut if the region to crop is the same width as the source image
    // https://github.com/oliver-moran/jimp/blob/master/packages/plugin-crop/src/index.js
    if (region.left === 0 && region.width === sourceImage.width) {
        const start = (region.width * region.top + region.left) * sourceImage.channels;
        const end = start + region.height * region.width * sourceImage.channels;
        croppedImage.pixels.set(sourceImage.pixels.slice(start, end));
    }

    // Fallback 'basic' cropping method
    else {
        for (let y = 0; y < region.height; y++) {
            // Calculate the start index and end index of this row
            const rowStart = ((region.top + y) * sourceImage.width + region.left) * sourceImage.channels;
            const rowEnd = rowStart + region.width * sourceImage.channels;

            // Slice the pixels for this row and add them to the cropped image pixel buffer
            const rowPixels = sourceImage.pixels.slice(rowStart, rowEnd);
            croppedImage.pixels.set(rowPixels, y * region.width * sourceImage.channels);
        }
    }

    return croppedImage;
};
