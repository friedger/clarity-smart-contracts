const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeContractDeploy,
  makeContractCall,
  FungibleConditionCode,
  standardPrincipalCV,
  broadcastTransaction,
  makeStandardSTXPostCondition,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";

describe("oi license contract test suite", async () => {
  it("should buy a non-expiring license", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    const network = new StacksTestnet();
    network.coreApiUrl = STACKS_API_URL;
    let contractName = "oi-license";
    let codeBody = fs
      .readFileSync("./contracts/license/license.clar")
      .toString();

    let fee = new BigNum(3000);
    let secretKey = keys.secretKey;
    let secretKey2 = keys2.secretKey;

    let transaction = await makeContractDeploy({
      contractName,
      codeBody,
      fee,
      senderKey: secretKey,
      nonce: new BigNum(0),
      network,
    });
    fs.writeFileSync("mempool/tx1.bin", transaction.serialize());

    var result = await broadcastTransaction(transaction, network);
    console.log(result);
    await new Promise((r) => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "buy-non-expiring";
    var functionArgs = [];

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      fee,
      senderKey: secretKey2,
      nonce: new BigNum(0),
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          keys2.stacksAddress,
          FungibleConditionCode.GreaterEqual,
          new BigNum(55)
        ),
      ],
    });

    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());
    var result = await broadcastTransaction(transaction, network);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    functionName = "has-valid-license";
    functionArgs = [standardPrincipalCV(keys2.stacksAddress)];

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      fee,
      senderKey: secretKey,
      nonce: new BigNum(1),
      network,
    });

    fs.writeFileSync("mempool/tx3.bin", transaction.serialize());
    var result = await broadcastTransaction(transaction, network);
    console.log(result);
  });
});
