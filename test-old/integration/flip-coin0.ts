const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  broadcastTransaction,
  makeContractDeploy,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("flip coin test suite", async () => {
  it("should deploy contract", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "flip-coin";
    // const contractName = "flip-coin-jackpot";
    // const contractName = "flip-coin-at-two";

    const codeBody = fs
      .readFileSync(`./contracts/experiments/${contractName}.clar`)
      .toString();

    const transaction = await makeContractDeploy({
      contractName,
      codeBody,
      fee: new BigNum(5998),
      senderKey: keysBuyer.secretKey,
      network,
    });

    console.log(await broadcastTransaction(transaction, network));
    return;
  });
});
