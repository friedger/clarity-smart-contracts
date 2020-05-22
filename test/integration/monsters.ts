import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  bufferCV,
  ChainID,
  StacksTestnet,
  broadcastTransaction,
} from "@blockstack/stacks-transactions";
const BigNum = require("bn.js");
import * as fs from "fs";

const STACKS_API_URL = "http://127.0.0.1:20443";

describe("monster contract test suite", async () => {
  it("should create and feed a monster", async () => {
    const keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    const keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    const network = new StacksTestnet();
    network.coreApiUrl = STACKS_API_URL;

    const contractAddress = keys.stacksAddress;
    const contractName = "monsters";
    const codeBody = fs
      .readFileSync("./contracts/monsters/monsters.clar")
      .toString();

    const secretKey = keys.secretKey;
    const secretKey2 = keys2.secretKey;

    var transaction = await makeSmartContractDeploy({
      contractName,
      codeBody,
      fee: new BigNum(2266),
      senderKey: secretKey,
      nonce: new BigNum(0),
      network,
    });
    console.log("deploy contract");
    var result = await broadcastTransaction(transaction, network);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    console.log("create");

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "create",
      functionArgs: [bufferCV(new Buffer("Black Tiger"))],
      fee: new BigNum(250),
      senderKey: secretKey,
      nonce: new BigNum(1),
      network,
    });
    var result = await broadcastTransaction(transaction, network);
    console.log(result);

    console.log("feed monster");
    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "feed-monster",
      functionArgs: [],
      fee: new BigNum(250),
      senderKey: secretKey2,
      nonce: new BigNum(0),
      network,
    });

    var result = await broadcastTransaction(transaction, network);
    console.log(result);
    await new Promise((r) => setTimeout(r, 10000));

    var result = await broadcastTransaction(transaction, network);
    console.log(result);
  });
});
