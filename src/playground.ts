import { ImageType } from "./image-operations/image.js";
import { getScreenshot } from "./grpc/get-screenshots.js";
import { emulatorAddress } from "../config/emulator-host.js";
import { dropChannel } from "./image-operations/drop-channel.js";
import { matchTemplate } from "./image-operations/template-matching.js";
import { loadTemplateByName } from "./image-operations/load-template.js";
import { createEmulatorControllerClient } from "./grpc/emulator-controller-client.js";

// Create an emulator client and grab a screenshot
const client = createEmulatorControllerClient(emulatorAddress);
const screenshot = await getScreenshot(client);

// Load and prepare the template image
const elevatorRiderTemplateRGBA = await loadTemplateByName("note_ride1");
const { modifiedSourceImage: elevatorRiderTemplateRGB } = dropChannel(elevatorRiderTemplateRGBA, ImageType.RGB, 4);

// Try to template match
const matches = matchTemplate(screenshot, elevatorRiderTemplateRGB);
console.log(matches);
