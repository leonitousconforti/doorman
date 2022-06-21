import { test } from "tap";
import { message, add } from "../src/main.js";

test("Test suite", async (t) => {
    t.equal(message, "Hi mom!", "Message should say hi mom");
    t.equal(add(1, 2), 3, "1 + 2 equals 3");
});
