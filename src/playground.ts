import { ImageType } from "./image-operations/image.js";
import { getScreenshot } from "./grpc/get-screenshots.js";
import { emulatorAddress } from "../config/emulator-host.js";
import { dropChannel } from "./image-operations/drop-channel.js";
import { upscaleImage } from "./image-operations/upscale-image.js";
import { calculateResourceScale } from "./calculate-resource-scale.js";
import { loadTemplateByName } from "./image-operations/load-template.js";
import { cropImage, CropRegion } from "./image-operations/crop-image.js";
import { createEmulatorControllerClient } from "./grpc/emulator-controller-client.js";
import { matchTemplate, OrientationOptions } from "./image-operations/template-matching.js";

// Create an emulator client and grab a screenshot
const client = createEmulatorControllerClient(emulatorAddress);
const screenshot = await getScreenshot(client);

// Crop the screenshot to the general area where the notes appear
const cropRegion: CropRegion = {
    left: 0,
    width: screenshot.width / 4,
    height: Math.round(screenshot.height / 8),
    top: screenshot.height - Math.round(screenshot.height / 8),
};
const croppedScreenshot = cropImage(screenshot, cropRegion);
const resourceScale = calculateResourceScale(screenshot.width, screenshot.height);

// Load and prepare the template image
const elevatorRiderTemplateRGBA = await loadTemplateByName("note_ride1");
const scaledElevatorRiderTemplate = upscaleImage(elevatorRiderTemplateRGBA, resourceScale);
const dropChannelResult = dropChannel(scaledElevatorRiderTemplate, ImageType.RGB, 4);
const elevatorRiderButtonMask = dropChannelResult.droppedChannelImage;
const elevatorRiderButtonTemplate = dropChannelResult.modifiedSourceImage;

// Try to template match
const orientationOptions: OrientationOptions = { noOverlapHorizontally: true };
const matches = matchTemplate(
    croppedScreenshot,
    elevatorRiderButtonTemplate,
    elevatorRiderButtonMask,
    orientationOptions
);
console.log(matches);
