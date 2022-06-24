import { test } from "tap";
import { Image, ImageType } from "../../src/image-operations/image.js";
import { upscaleImage } from "../../src/image-operations/upscale-image.js";

test("Should fail to upscale image", async (t) => {
    const testImage: Image = {
        width: 3,
        height: 4,
        channels: 1,
        format: ImageType.GRAY,
        pixels: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    };
    t.throws(() => upscaleImage(testImage, -1), /Invalid scale factor/);
    t.throws(() => upscaleImage(testImage, 1.5), /Invalid scale factor/);
});

test("Should upscale image 3x", async (t) => {
    const testImage: Image = {
        width: 3,
        height: 4,
        channels: 1,
        format: ImageType.GRAY,
        pixels: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    };
    const resultImage = upscaleImage(testImage, 3);

    t.equal(resultImage.width, 3 * 3, "expect width to be 9");
    t.equal(resultImage.height, 4 * 3, "expect height to be 12");
    t.equal(resultImage.channels, 1, "expect one channels");
    t.strictSame(
        [...resultImage.pixels],
        [
            1, 1, 1, 2, 2, 2, 3, 3, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6,
            4, 4, 4, 5, 5, 5, 6, 6, 6, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 7, 7, 7, 8, 8, 8, 9, 9, 9,
            7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 10, 10, 10, 11, 11, 11, 12, 12, 12, 10, 10,
            10, 11, 11, 11, 12, 12, 12,
        ],
        "expect correct pixel buffer"
    );
});
