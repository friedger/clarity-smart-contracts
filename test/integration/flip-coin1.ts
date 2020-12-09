const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  broadcastTransaction,
  makeContractCall,
  trueCV,
  makeContractSTXPostCondition,
  contractPrincipalCV,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

import BN from "bn.js";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("flip coin test suite", async () => {
  it("should deploy contract", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "flip-coin-jackpot";

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "bet",
      functionArgs: [trueCV()],
      fee: new BigNum(284),
      senderKey: keysBuyer.secretKey,
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          contractAddress,
          FungibleConditionCode.Equal,
          new BigNum(1000)
        ),
        makeContractSTXPostCondition(
          contractAddress,
          contractName,
          FungibleConditionCode.GreaterEqual,
          new BigNum(0)
        ),
      ],
    });

    console.log(await broadcastTransaction(transaction, network));
    return;
  });
});
