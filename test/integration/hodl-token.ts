const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeContractDeploy,
  makeContractCall,
  FungibleConditionCode,
  standardPrincipalCV,
  uintCV,
  makeStandardFungiblePostCondition,
  makeContractFungiblePostCondition,
  broadcastTransaction,
  createAssetInfo,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";

describe("hold token test suite", async () => {
  it("should buy and hold tokens", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let secretKey = keys.secretKey;
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    let secretKey2 = keys2.secretKey;
    const network = new StacksTestnet();
    network.coreApiUrl = STACKS_API_URL;

    let contractName = "hodl-token";
    var contractAddress = keys.stacksAddress;

    let codeBody = fs
      .readFileSync("./contracts/tokens/hodl-token.clar")
      .toString();

    let fee = new BigNum(2000);

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

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "hodl",
      functionArgs: [uintCV(5)],
      fee,
      senderKey: secretKey,
      nonce: new BigNum(1),
      network,
      postConditions: [
        makeContractFungiblePostCondition(
          "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
          "hodl-token",
          FungibleConditionCode.Equal,
          new BigNum(5),
          createAssetInfo(contractAddress, "hodl-token", "hodl-token")
        ),
        makeStandardFungiblePostCondition(
          contractAddress,
          FungibleConditionCode.Equal,
          new BigNum(5),
          createAssetInfo(contractAddress, "hodl-token", "spendable-token")
        ),
      ],
    });

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());
    result = await broadcastTransaction(transaction, network);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "hodl-balance-of",
      functionArgs: [standardPrincipalCV(keys.stacksAddress)],
      fee,
      senderKey: secretKey2,
      nonce: new BigNum(0),
      network,
    });

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx3.bin", transaction.serialize());
    result = await broadcastTransaction(transaction, network);
    console.log(result);

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "unhodl",
      functionArgs: [uintCV(3)],
      fee,
      senderKey: secretKey,
      nonce: new BigNum(2),
      network,
      postConditions: [
        makeContractFungiblePostCondition(
          "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
          "hodl-token",
          FungibleConditionCode.Equal,
          new BigNum(3),
          createAssetInfo(contractAddress, "hodl-token", "spendable-token")
        ),
        makeStandardFungiblePostCondition(
          contractAddress,
          FungibleConditionCode.Equal,
          new BigNum(3),
          createAssetInfo(contractAddress, "hodl-token", "hodl-token")
        ),
      ],
    });

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx4.bin", transaction.serialize());
    result = await broadcastTransaction(transaction, network);
    console.log(result);
  });
});
