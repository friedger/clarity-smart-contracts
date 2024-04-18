const BigNum = require("bn.js");
import * as fs from "fs";
import {
  serializeCV,
  deserializeCV,
  BooleanCV,
  uintCV,
  UIntCV,
  OptionalCV,
  addressToString,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;
const betAtHeight = 41;

const keys = JSON.parse(fs.readFileSync("./keys.json").toString());
const contractAddress = "ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV"; //keys.stacksAddress;

describe("flip coin test suite", async () => {
  it("should flip coin", async () => {
    const contractName = "flip-coin";
    const functionName = "flip-coin";

    const response = await fetch(
      network.coreApiUrl +
        `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"sender":"${contractAddress}","arguments":[]}`,
      }
    );
    const result = await response.json();
    const resultValue = deserializeCV(
      Buffer.from(result.result.substr(2), "hex")
    );

    const resultData = resultValue as BooleanCV;
    console.log(resultData);
  });

  it("should get winner ", async () => {
    const contractName = "flip-coin-jackpot";
    const functionName = encodeURIComponent("get-optional-winner-at");

    const height = serializeCV(uintCV(betAtHeight));
    const response = await fetch(
      network.coreApiUrl +
        `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"sender":"${contractAddress}","arguments":["0x${height.toString(
          "hex"
        )}"]}`,
      }
    );
    if (response.status === 200) {
      const result = await response.json();
      if (result.okay) {
        const resultValue = deserializeCV(
          Buffer.from(result.result.substr(2), "hex")
        );

        const optionalWinner = resultValue as OptionalCV;
        if (optionalWinner.type === 9) {
          console.log(`No winner`);
        } else {
          console.log(
            `Winner is: ${addressToString(optionalWinner["value"].address)}`
          );
        }
      } else {
        console.log(result);
      }
    } else {
      console.log(response);
    }
  });

  it("should get amount ", async () => {
    const contractName = "flip-coin-jackpot";
    const functionName = "get-amount-at";

    const height = serializeCV(uintCV(betAtHeight));
    const response = await fetch(
      network.coreApiUrl +
        `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"sender":"${contractAddress}","arguments":["0x${height.toString(
          "hex"
        )}"]}`,
      }
    );
    if (response.status === 200) {
      const result = await response.json();
      if (result.okay) {
        const resultValue = deserializeCV(
          Buffer.from(result.result.substr(2), "hex")
        );

        const resultData = resultValue as UIntCV;
        console.log(`Prize is ${resultData.value.toString(10)}`);
      } else {
        console.log(result);
      }
    } else {
      console.log(response);
    }
  });

  it("should get jackpot ", async () => {
    const contractName = "flip-coin-jackpot";
    const functionName = "get-jackpot";

    const response = await fetch(
      network.coreApiUrl +
        `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"sender":"${contractAddress}","arguments":[]}`,
      }
    );
    if (response.status === 200) {
      const result = await response.json();
      if (result.okay) {
        const resultValue = deserializeCV(
          Buffer.from(result.result.substr(2), "hex")
        );

        const resultData = resultValue as UIntCV;
        console.log(`Jackpot is ${resultData.value}`);
      } else {
        console.log(result);
      }
    } else {
      console.log(response);
    }
  });
});
