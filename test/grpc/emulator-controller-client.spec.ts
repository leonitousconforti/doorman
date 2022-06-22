import { test } from "tap";
import { getStatus } from "../../src/grpc/get-status.js";
import { createEmulatorControllerClient } from "../../src/grpc/emulator-controller-client.js";
import { emulatorHost, emulatorGrpcPort, emulatorAddress } from "../../config/emulator-host.js";

// Create an emulator controller client on the default port 5556
test("Should successfully create an emulator controller client on port 5556", async (t) => {
    const client = createEmulatorControllerClient(emulatorAddress);
    t.resolves(getStatus(client), "client created");
    const status = await getStatus(client);
    t.equal(status.booted, true, "emulator has booted");
});

// Create an emulator controller client on port 5557
test("Should fail to create an emulator controller client on port 5557", async (t) => {
    const client = createEmulatorControllerClient(`${emulatorHost}:${emulatorGrpcPort + 1}`);
    t.rejects(getStatus(client), /No connection established/g);
});

// Create an emulator controller client on port 5556 with options
test("Should create an emulator controller client with larger max message receive size", async (t) => {
    const emulatorControllerOptions = { "grpc.max_concurrent_streams": 1 };
    const client = createEmulatorControllerClient(emulatorAddress, undefined, emulatorControllerOptions);
    t.resolves(getStatus(client), "client created");
    const status = await getStatus(client);
    t.equal(status.booted, true, "emulator has booted");
});
