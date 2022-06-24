import { test } from "tap";
import { Image, ImageType } from "../../src/image-operations/image.js";
import { dropChannel } from "../../src/image-operations/drop-channel.js";

test("Should drop a channel from an image", async (t) => {
    const testImage: Image = {
        width: 2,
        height: 2,
        channels: 3,
        format: ImageType.BGR,
        pixels: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    };
    const { modifiedSourceImage, droppedChannelImage } = dropChannel(testImage, ImageType.GRAY_A, 3);

    t.equal(modifiedSourceImage.channels, 2, "expect two channels");
    t.equal(modifiedSourceImage.format, ImageType.GRAY_A, "expect grayscale with alpha image type");
    t.equal(modifiedSourceImage.pixels.length, 2 * 2 * 2, "expect pixel buffer to contain 8 values");
    t.strictSame(
        [...modifiedSourceImage.pixels],
        [1, 2, 4, 5, 7, 8, 10, 11],
        "expect pixel buffer to be [1, 2, 4, 5, 7, 8, 10, 11]"
    );

    t.equal(droppedChannelImage.channels, 1, "expect one channel");
    t.equal(droppedChannelImage.format, ImageType.GRAY, "expect grayscale image type");
    t.equal(droppedChannelImage.pixels.length, 2 * 2, "expect pixel buffer to contain 4 values");
    t.strictSame([...droppedChannelImage.pixels], [3, 6, 9, 12], "expect pixel buffer to be [3, 6, 9, 12]");
});
