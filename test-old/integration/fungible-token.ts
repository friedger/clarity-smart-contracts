const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  standardPrincipalCV,
  AssetInfo,
  uintCV,
  broadcastTransaction,
  makeStandardFungiblePostCondition,
  createAssetInfo,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";

describe("fungible token test suite", async () => {
  it("should buy and hold tokens", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let secretKey = keys.secretKey;
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    let secretKey2 = keys2.secretKey;

    const network = new StacksTestnet();
    network.coreApiUrl = STACKS_API_URL;

    let contractName = "fungible-token";
    let codeBody = fs
      .readFileSync("./contracts/tokens/fungible-token.clar")
      .toString();

    let fee = new BigNum(5000);

    let transaction = await makeContractDeploy({
      contractName,
      codeBody,
      fee,
      senderKey: secretKey,
      nonce: new BigNum(0),
      network,
    });
    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx1.bin", transaction.serialize());
    var result = await broadcastTransaction(transaction, network);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "transfer-token";
    var functionArgs = [uintCV(5), standardPrincipalCV(keys2.stacksAddress)];

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      fee,
      senderKey: secretKey,
      nonce: new BigNum(1),
      network,
      postConditions: [
        makeStandardFungiblePostCondition(
          keys.stacksAddress,
          FungibleConditionCode.Equal,
          new BigNum(5),
          createAssetInfo(contractAddress, contractName, "fungible-token")
        ),
      ],
    });

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());
    var result = await broadcastTransaction(transaction, network);

    await new Promise((r) => setTimeout(r, 10000));

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "balance-of",
      functionArgs: [standardPrincipalCV(keys.stacksAddress)],
      fee,
      senderKey: secretKey2,
      nonce: new BigNum(0),
      network,
    });

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx3.bin", transaction.serialize());
    var result = await broadcastTransaction(transaction, network);
    console.log(result);
  });
});
