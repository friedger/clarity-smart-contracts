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
  uintCV,
  trueCV,
  makeContractSTXPostCondition,
} from "@blockstack/stacks-transactions";
import BN from "bn.js";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("flip coin test suite", async () => {
  it("should deploy contract", async () => {
    const keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    const keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());

    const contractAddress = keys.stacksAddress;
    const contractName = "flip-coin";

    const senderAddress = keys2.stacksAddress;

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "bet",
      functionArgs: [uintCV(10), trueCV()],
      fee: new BigNum(247),
      senderKey: keys2.secretKey,
      nonce: new BigNum(0),
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          senderAddress,
          FungibleConditionCode.Equal,
          new BigNum(10)
        ),
        makeContractSTXPostCondition(
          contractAddress,
          contractName,
          FungibleConditionCode.LessEqual,
          new BigNum(20)
        ),
      ],
    });

    console.log(await broadcastTransaction(transaction, network));
    return;
  });
});
