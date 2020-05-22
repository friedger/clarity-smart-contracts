const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  StacksTestnet,
  broadcastTransaction,
  makeSmartContractDeploy,
  makeContractCall,
  serializeCV,
  deserializeCV,
  TupleCV,
  BooleanCV,
  uintCV,
} from "@blockstack/stacks-transactions";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;
const betAtHeight = 18;

describe("flip coin test suite", async () => {
  it("should flip coin", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
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
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "flip-coin";
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
    console.log(response.status);
    if (response.status === 200) {
      const result = await response.json();
      if (result.okay) {
        console.log(result);
        const resultValue = deserializeCV(
          Buffer.from(result.result.substr(2), "hex")
        );

        const resultData = resultValue as BooleanCV;
        console.log(resultData);
      } else {
        console.log(result);
      }
    } else {
      console.log(response);
    }
  });

  it("should get amount ", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "flip-coin";
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
    console.log(response.status);
    if (response.status === 200) {
      const result = await response.json();
      if (result.okay) {
        console.log(result);
        const resultValue = deserializeCV(
          Buffer.from(result.result.substr(2), "hex")
        );

        const resultData = resultValue as BooleanCV;
        console.log(resultData);
      } else {
        console.log(result);
      }
    } else {
      console.log(response);
    }
  });
});
