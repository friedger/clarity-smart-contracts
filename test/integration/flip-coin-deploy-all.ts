const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  StacksTestnet,
  broadcastTransaction,
  makeSmartContractDeploy,
} from "@blockstack/stacks-transactions";
import { serializePayload } from "@blockstack/stacks-transactions/lib/payload";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

const keys = JSON.parse(fs.readFileSync("./keys.json").toString());
const contractAddress = keys.stacksAddress;

async function deployContract(contractName, fee) {
  const codeBody = fs
    .readFileSync(`./contracts/experiments/${contractName}.clar`)
    .toString();

  const transaction = await makeSmartContractDeploy({
    contractName,
    codeBody,
    senderKey: keys.secretKey,
    fee: new BigNum(fee),
    network,
  });

  console.log(await broadcastTransaction(transaction, network));
}

function processing() {
  return new Promise((resolve) => {
    setTimeout(resolve, 20000);
  });
}
describe("flip coin test suite", async () => {
  it("should deploy contracts", async () => {
    var contractName = "flip-coin-tax-office";
    deployContract(contractName, 224);
    //await processing();
    var contractName = "flip-coin-jackpot";
    deployContract(contractName, 4621);
    //await processing();
    var contractName = "flip-coin-at-two";
    deployContract(contractName, 6253);
    return;
  });
});
