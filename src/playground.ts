import { getScreenshot } from "./grpc/get-screenshots.js";
import { emulatorAddress } from "../config/emulator-host.js";
import { matchTemplate } from "./image-operations/template-matching.js";
import { loadTemplateByName } from "./image-operations/load-template.js";
import { createEmulatorControllerClient } from "./grpc/emulator-controller-client.js";

// Create an emulator client and grab a screenshot
const client = createEmulatorControllerClient(emulatorAddress);
const screenshot = await getScreenshot(client);

// Load the template image
const elevatorRiderTemplate = await loadTemplateByName("note_ride1");

// Try to template match
const matches = matchTemplate(screenshot, elevatorRiderTemplate);
console.log(matches);
