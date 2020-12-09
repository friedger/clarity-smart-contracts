const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  broadcastTransaction,
  makeContractDeploy,
  makeContractCall,
  uintCV,
  trueCV,
  makeContractSTXPostCondition,
  falseCV,
  contractPrincipalCV,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

import BN from "bn.js";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("flip coin test suite", async () => {
  it("should deploy contract", async () => {
    const keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    const keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());

    const contractAddress = keys.stacksAddress;
    const contractName = "flip-coin-jackpot";

    const senderAddress = keys2.stacksAddress;

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "bet",
      functionArgs: [falseCV()],
      fee: new BigNum(284),
      senderKey: keys2.secretKey,
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          senderAddress,
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
