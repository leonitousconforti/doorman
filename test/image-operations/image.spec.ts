import { test } from "tap";
import { ImageType, imageTypeFromChannelsForPng } from "../../src/image-operations/image.js";

test("Should determine the image type from number of channels", async (t) => {
    t.equal(imageTypeFromChannelsForPng(1), ImageType.GRAY, "1 channel should result in grayscale image type");
    t.equal(imageTypeFromChannelsForPng(2), ImageType.GRAY_A, "2 channels should result in grayscale with alpha");
    t.equal(imageTypeFromChannelsForPng(3), ImageType.RGB, "3 channels should result in rgb");
    t.equal(imageTypeFromChannelsForPng(4), ImageType.RGB_A, "4 channels should result in rgb with alpha");
});
