const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  broadcastTransaction,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("transfer test suite", async () => {
  it("should deposit and payout balance", async () => {
    // "8dd1d5a6d21600c9d75d409e61b866eea8061fb09577b087b44b8b3870360fd401",
    // ST200ZD1N2TWNJNTEN9WQ4R3R24ZX2FYAX879E3PZ
    const t = await makeSTXTokenTransfer({
      recipient: "ST3W3ER491J8J2XBE54B2KV008QA4N30C7D6HRM3N",
      amount: new BigNum(100000),
      senderKey:
        "f2cc535c24d694362507737df6feaca594f2b7ee9409a3c04970ffdde5f0fcc001",
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          "ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV",
          FungibleConditionCode.LessEqual,
          new BigNum(100000)
        ),
      ],
    });
    console.log(await broadcastTransaction(t, network));
    return;
  });
});
