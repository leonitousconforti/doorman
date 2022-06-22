import assert from "node:assert";

// Doorman image type
import { Image, ImageType } from "../image-operations/image.js";

// Generated types from the protobuf file
import { Rotation } from "../proto/generated/android/emulation/control/Rotation.js";
import { FoldedDisplay } from "../proto/generated/android/emulation/control/FoldedDisplay.js";
import { ImageTransport } from "../proto/generated/android/emulation/control/ImageTransport.js";
import { EmulatorControllerClient } from "../proto/generated/android/emulation/control/EmulatorController.js";
import {
    ImageFormat,
    _android_emulation_control_ImageFormat_ImgFormat as RequestedImageFormat,
} from "../proto/generated/android/emulation/control/ImageFormat.js";

// Default screenshot request params
const defaultScreenshotRequest: ImageFormat = {
    // Three channel RGB format
    format: "RGB888",

    // No rotation
    rotation: {
        rotation: "PORTRAIT",
        xAxis: undefined,
        yAxis: undefined,
        zAxis: undefined,
    } as Rotation,

    // Use the width and height of the display
    width: undefined,
    height: undefined,

    // Use the main display
    display: 0,

    // Transport the image as a raw buffer
    transport: {
        channel: "TRANSPORT_CHANNEL_UNSPECIFIED",
        handle: undefined,
    } as ImageTransport,

    // Ignore folding display settings
    foldedDisplay: {
        width: undefined,
        height: undefined,
        xOffset: undefined,
        yOffset: undefined,
    } as FoldedDisplay,

    // Ignore display mode because AVD is not re-sizeable
    displayMode: undefined,
};

export const getScreenshot = (
    emulatorControllerClient: EmulatorControllerClient,
    requestOptions = defaultScreenshotRequest
): Promise<Image> =>
    new Promise((resolve, reject) => {
        emulatorControllerClient.getScreenshot(requestOptions, function (error, image) {
            if (error) return reject(error);

            assert.ok(image);
            assert.ok(image.image);
            assert.ok(image.format);
            assert.ok(image.format.width);
            assert.ok(image.format.height);
            assert.ok(image.format.format);

            return resolve({
                pixels: image.image,
                width: image.format.width,
                height: image.format.height,
                channels: image.format.format === RequestedImageFormat.RGB888 ? 3 : 4,
                format: image.format.format === RequestedImageFormat.RGB888 ? ImageType.RGB : ImageType.RGB_A,
            });
        });
    });
