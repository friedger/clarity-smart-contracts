const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  uintCV,
  ChainID,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  broadcastTransaction,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://localhost:20443";

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

    var fee = new BigNum(2548);
    const secretKeyBuyer = keysBuyer.secretKey;
    const secretKeySeller = keysSeller.secretKey;
    const network = new StacksTestnet();
    network.coreApiUrl = STACKS_API_URL;

    console.log("deploy contract");
    var transaction = await makeContractDeploy({
      contractName,
      codeBody,
      fee,
      senderKey: secretKeyBuyer,
      nonce: new BigNum(0),
      network,
    });
    console.log(await broadcastTransaction(transaction, network));
    await new Promise((r) => setTimeout(r, 30000));

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
    console.log(await broadcastTransaction(transaction, network));

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

    console.log(await broadcastTransaction(transaction, network));
    await new Promise((r) => setTimeout(r, 10000));

    console.log("accept buyer");
    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "accept",
      functionArgs: [],
      fee,
      senderKey: secretKeyBuyer,
      nonce: new BigNum(2),
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
    console.log(await broadcastTransaction(transaction, network));
  });
});
