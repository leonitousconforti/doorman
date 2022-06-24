import { test } from "tap";
import { Image, ImageType } from "../../src/image-operations/image.js";
import { cropImage, CropRegion } from "../../src/image-operations/crop-image.js";

test("Should throw error when given invalid crop region", async (t) => {
    const testImage: Image = {
        width: 4,
        height: 4,
        channels: 1,
        format: ImageType.GRAY,
        pixels: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    };

    t.test("Should give error when crop region height extends source image height", async (t) => {
        const badRegion: CropRegion = { top: 1, left: 0, width: testImage.width, height: testImage.height };
        t.throws(() => cropImage(testImage, badRegion), /region extends beyond the images height/g);
    });

    t.test("Should give error when crop region width extends source image width", async (t) => {
        const badRegion: CropRegion = { top: 0, left: 1, width: testImage.width, height: testImage.height };
        t.throws(() => cropImage(testImage, badRegion), /region extends beyond the images width/g);
    });
});

test("Should crop the image to the specified region", async (t) => {
    const region: CropRegion = { top: 1, left: 1, width: 2, height: 2 };
    const testImage: Image = {
        width: 3,
        height: 3,
        channels: 1,
        format: ImageType.GRAY,
        pixels: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    };
    const croppedImage = cropImage(testImage, region);
    t.equal(croppedImage.width, 2, "expect width to be 2");
    t.equal(croppedImage.height, 2, "expect height to be 2");
    t.equal(croppedImage.channels, 1, "expect channels to be 1");
    t.strictSame([...croppedImage.pixels], [5, 6, 8, 9], "expect pixel buffer to be [5, 6, 8, 9]");
});

test("Should crop the image to the specified region using the shortcut", async (t) => {
    const region: CropRegion = { top: 1, left: 0, width: 3, height: 2 };
    const testImage: Image = {
        width: 3,
        height: 3,
        channels: 1,
        format: ImageType.GRAY,
        pixels: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    };
    const croppedImage = cropImage(testImage, region);
    t.equal(croppedImage.width, 3, "expect width to be 3");
    t.equal(croppedImage.height, 2, "expect height to be 2");
    t.equal(croppedImage.channels, 1, "expect one channel");
    t.strictSame([...croppedImage.pixels], [4, 5, 6, 7, 8, 9], "expect pixel buffer to be [4, 5, 6, 7, 8, 9]");
});
