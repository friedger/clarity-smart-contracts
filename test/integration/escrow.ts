const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  uintCV,
  ChainID,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  StacksTestnet,
  broadcastTransaction,
} from "@blockstack/stacks-transactions";

const STACKS_API_URL = "http://localhost:20443/v2/transactions";

describe("escrow contract test suite", async () => {
  it("should deposit and payout balance", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());
    const keysSeller = JSON.parse(fs.readFileSync("./keys2.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "escrow";
    const codeBody = fs
      .readFileSync("./contracts/tokens/escrow.clar")
      .toString();

    const price = 0x1000;

    var fee = new BigNum(1401);
    const secretKeyBuyer = keysBuyer.secretKey;
    const secretKeySeller = keysSeller.secretKey;
    const network = new StacksTestnet();
    network.broadcastApiUrl = STACKS_API_URL;

    console.log("deploy contract");
    var transaction = await makeSmartContractDeploy({
      contractName,
      codeBody,
      fee,
      senderKey: secretKeyBuyer,
      nonce: new BigNum(0),
      network,
    });
    var result = await broadcastTransaction(transaction, network);
    console.log(result);
    await new Promise((r) => setTimeout(r, 20000));

    console.log("deposit");
    fee = new BigNum(256);

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "deposit",
      functionArgs: [uintCV(price)],
      fee,
      senderKey: secretKeyBuyer,
      nonce: new BigNum(1),
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          keysBuyer.stacksAddress,
          FungibleConditionCode.Equal,
          new BigNum(price)
        ),
      ],
    });
    var result = await broadcastTransaction(transaction, network);
    console.log(result);

    console.log("accept seller");
    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "accept",
      functionArgs: [],
      fee,
      senderKey: secretKeySeller,
      nonce: new BigNum(0),
      network,
    });

    var result = await broadcastTransaction(transaction, network);
    console.log(result);
    await new Promise((r) => setTimeout(r, 10000));

    console.log("accept buyer");
    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "accept",
      functionArgs: [],
      fee,
      senderKey: secretKeyBuyer,
      nonce: new BigNum(3),
      network,
      postConditions: [
        makeContractSTXPostCondition(
          contractAddress,
          "escrow",
          FungibleConditionCode.LessEqual,
          new BigNum(price)
        ),
      ],
    });
    var result = await broadcastTransaction(transaction, network);
    console.log(result);
  });
});
