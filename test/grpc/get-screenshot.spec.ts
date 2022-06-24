import { test } from "tap";
import { emulatorAddress } from "../../config/emulator-host.js";
import { ImageType } from "../../src/image-operations/image.js";
import { getScreenshot } from "../../src/grpc/get-screenshots.js";
import { createEmulatorControllerClient } from "../../src/grpc/emulator-controller-client.js";
import { ImageFormat } from "../../src/proto/generated/android/emulation/control/ImageFormat.js";

const tinyReceiveOptions = { "grpc.max_receive_message_length": 1 * 1024 };
const largeReceiveOptions = { "grpc.max_receive_message_length": 12 * 1024 * 1024 };
const clientWithTinyReceive = createEmulatorControllerClient(emulatorAddress, undefined, tinyReceiveOptions);
const clientWithLargerReceive = createEmulatorControllerClient(emulatorAddress, undefined, largeReceiveOptions);

// Fails to get a screenshot because it is too much data
test("Should fail to get a screenshot when receive buffer is too small", async (t) => {
    t.rejects(getScreenshot(clientWithTinyReceive));
});

// Get a screenshot with the default options
test("Should get a screenshot in rgb format", async (t) => {
    const screenshot = await getScreenshot(clientWithLargerReceive);
    t.equal(screenshot.channels, 3, "expect three channels");
    t.equal(screenshot.format, ImageType.RGB, "image format should be rgb");
    t.equal(
        screenshot.pixels.length,
        screenshot.width * screenshot.height * screenshot.channels,
        "pixel buffer should be correct size"
    );
});

// Get a screenshot with non-default options
test("Should get a screenshot in rgba format", async (t) => {
    const ImageOptionsWithAlpha: ImageFormat = { format: "RGBA8888" };
    const screenshot = await getScreenshot(clientWithLargerReceive, ImageOptionsWithAlpha);
    t.equal(screenshot.channels, 4, "expect four channels");
    t.equal(screenshot.format, ImageType.RGB_A, "image format should be rgb_a");
    t.equal(
        screenshot.pixels.length,
        screenshot.width * screenshot.height * screenshot.channels,
        "pixel buffer should be correct size"
    );
});
