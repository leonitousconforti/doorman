import { test } from "tap";
import { loadPng } from "../helpers/load-png.js";
import { Image, ImageType } from "../../src/image-operations/image.js";
import { matchTemplate } from "../../src/image-operations/template-matching.js";

// Images from https://pyimagesearch.com/2021/03/22/opencv-template-matching-cv2-matchtemplate/
const searchImage1 = await loadPng(new URL("../data/searchImage.png", import.meta.url));
const templateImage1 = await loadPng(new URL("../data/templateImage.png", import.meta.url));
const searchImage2 = await loadPng(new URL("../data/searchImageWithAlpha.png", import.meta.url));
const templateImage2 = await loadPng(new URL("../data/templateImageWithAlpha.png", import.meta.url));

// Simple use of match template algorithm
test("Should locate the template image", async (t) => {
    const matches = matchTemplate(searchImage1, templateImage1);
    t.equal(matches.length, 1, "expect 1 match");
    t.strictSame(matches[0], { position: { x: 29, y: 26 }, similarity: 1 }, "expect the correct location");
});

// Mask must have correct properties
test("Should fail when mask is not setup correctly", async (t) => {
    const badMask: Image = {
        width: 0,
        height: 0,
        channels: 2,
        format: ImageType.GRAY,
        pixels: Buffer.from([]),
    };
    t.throws(() => matchTemplate(searchImage1, templateImage1, badMask), /Mask must have only one channel/g);
    badMask.channels = 1;
    t.throws(() => matchTemplate(searchImage1, templateImage1, badMask), /Mask must be same width as template image/g);
    badMask.width = templateImage1.width;
    t.throws(() => matchTemplate(searchImage1, templateImage1, badMask), /Mask must be same height as template image/g);
});

// Mask can eliminate all pixels from being searched, so no matches
test("Should not find any matches if all pixels in mask are less than 255", async (t) => {
    const mask: Image = {
        width: templateImage1.width,
        height: templateImage1.height,
        channels: 1,
        format: ImageType.GRAY,
        pixels: Buffer.alloc(templateImage1.width * templateImage1.height, 0),
    };
    const matches = matchTemplate(searchImage1, templateImage1, mask);
    t.equal(matches.length, 0, "expect zero matches");
});

// Should apply the mask appropriately
test("Should apply the mask appropriately", async (t) => {
    const width = 2,
        height = 2,
        channels = 3;

    const searchPixels = Buffer.from([117, 68, 102, 22, 80, 48, 36, 162, 233, 232, 30, 144]);
    const templatePixels = Buffer.from([117, 68, 102, 122, 30, 248, 36, 162, 233, 23, 167, 54]);
    const maskPixels = Buffer.from([255, 0, 255, 0]);

    const searchImage: Image = { width, height, channels, format: ImageType.RGB, pixels: searchPixels };
    const templateImage: Image = { width, height, channels, format: ImageType.RGB, pixels: templatePixels };
    const mask: Image = { width, height, channels: 1, format: ImageType.GRAY, pixels: maskPixels };

    const matches = matchTemplate(searchImage, templateImage, mask);
    t.equal(matches.length, 1, "expect one match");
    t.strictSame(matches[0], { position: { x: 0, y: 0 }, similarity: 1 }, "expect the correct location");
});

test("Should work with images with alpha but triggers warning", async (t) => {
    const matches = matchTemplate(searchImage2, templateImage2);
    t.equal(matches.length, 1, "expect one match");
    t.strictSame(matches[0], { position: { x: 81, y: 6 }, similarity: 1 }, "expect the correct location");
});

test("Should work with large images but triggers warning about domain", async (t) => {
    const matches = matchTemplate(searchImage1, searchImage1);
    t.equal(matches.length, 1, "expect one match");
    t.strictSame(matches[0], { position: { x: 0, y: 0 }, similarity: 1 }, "expect the correct location");
});

test("Should use orientation options", async (t) => {
    const matches = matchTemplate(searchImage1, templateImage1, undefined, {
        overlapHorizontally: true,
        overlapVertically: true,
    });
    t.equal(matches.length, 1, "expect one match");
    t.strictSame(
        matches[0],
        { position: { x: 44, y: 25 }, similarity: 0.821_204_991_087_344 },
        "expect the correct location"
    );
});
