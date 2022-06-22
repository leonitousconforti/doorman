export type Image = {
    width: number;
    height: number;
    channels: 1 | 2 | 3 | 4;
    pixels: Buffer;
    format: ImageType;
};

export enum ImageType {
    // One channel image formats
    GRAY = "Grayscale",

    // Two channel image formats
    GRAY_A = "Grayscale with alpha",

    // Three channels image formats
    RGB = "RGB",
    BGR = "BGR",

    // Four channel image formats
    RGB_A = "RGB with alpha",
    BGR_A = "BGR with alpha",
}
