const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  StacksTestnet,
  broadcastTransaction,
  makeContractCall,
  trueCV,
} from "@blockstack/stacks-transactions";
import BN from "bn.js";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("flip coin test suite", async () => {
  it("should deploy contract", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "flip-coin";

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "bet",
      functionArgs: [trueCV()],
      fee: new BigNum(188),
      senderKey: keysBuyer.secretKey,
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          contractAddress,
          FungibleConditionCode.Equal,
          new BigNum(1000)
        ),
      ],
    });

    console.log(await broadcastTransaction(transaction, network));
    return;
  });
});
