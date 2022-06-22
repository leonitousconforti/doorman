import assert from "node:assert";

// Generated types from the protobuf file
import { EmulatorStatus__Output } from "../proto/generated/android/emulation/control/EmulatorStatus.js";
import { EmulatorControllerClient } from "../proto/generated/android/emulation/control/EmulatorController.js";

export const getStatus = (client: EmulatorControllerClient): Promise<EmulatorStatus__Output> =>
    new Promise((resolve, reject) => {
        client.getStatus({}, function (error, data) {
            if (error) return reject(error);
            assert.ok(data);
            return resolve(data);
        });
    });
