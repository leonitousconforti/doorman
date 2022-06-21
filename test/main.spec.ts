import "should";
import tap from "tap";
import { message, add } from "../src/main.js";

tap.mocha.describe("Test suite", function () {
    tap.mocha.it("Message should say hi mom", function () {
        message.should.equal("Hi, mom!");
    });

    tap.mocha.it("Should add two numbers", function () {
        add(1, 2).should.equal(3);
    });
});
