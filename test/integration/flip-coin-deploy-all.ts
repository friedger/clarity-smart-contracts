const BigNum = require("bn.js");
import * as fs from "fs";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  StacksTestnet,
  broadcastTransaction,
  makeSmartContractDeploy,
  createStacksPublicKey,
  createStacksPrivateKey,
  pubKeyfromPrivKey,
  createAddress,
  addressToString,
  addressFromPublicKeys,
  AddressVersion,
  AddressHashMode,
  makeContractCall,
} from "@blockstack/stacks-transactions";

const STACKS_API_URL = "http://testnet-master.blockstack.org:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

const keys = JSON.parse(
  fs.readFileSync("../../blockstack/stacks-blockchain/keychain.json").toString()
).paymentKeyInfo;
async function deployContract(contractName, fee) {
  const codeBody = fs
    .readFileSync(`./contracts/experiments/${contractName}.clar`)
    .toString();

  const transaction = await makeSmartContractDeploy({
    contractName,
    codeBody,
    senderKey: keys.privateKey,
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
    /*
    var contractName = "flip-coin";
    await deployContract(contractName, 1780);
    await processing();
    var contractName = "flip-coin-tax-office";
    await deployContract(contractName, 224);
    await processing();
    var contractName = "flip-coin-jackpot";
    await deployContract(contractName, 3200);
    await processing();
    */
    var contractName = "flip-coin-at-two";
    await deployContract(contractName, 4788);
    return;
  });
});
