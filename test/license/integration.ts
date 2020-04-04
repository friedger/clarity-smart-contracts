const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  standardPrincipalCV
} from "@blockstack/stacks-transactions";
import { makeStandardSTXPostCondition } from "@blockstack/stacks-transactions/lib/src/builders";

describe("oi license contract test suite", async () => {
  it("should buy a non-expiring license", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());

    let contractName = "oi-license";
    let code = fs.readFileSync("./contracts/license/license.clar").toString();

    let feeRate = new BigNum(0);
    let secretKey = keys.secretKey;

    let transaction = makeSmartContractDeploy(
      contractName,
      code,
      feeRate,
      secretKey,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet
      }
    );
    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx1.bin", transaction.serialize());

    await new Promise(r => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "buy-non-expiring";
    var functionArgs = [];

    transaction = makeContractCall(
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      feeRate,
      secretKey,
      {
        nonce: new BigNum(1),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeStandardSTXPostCondition(
            contractAddress,
            FungibleConditionCode.GreaterEqual,
            new BigNum(55)
          )
        ]
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());

    await new Promise(r => setTimeout(r, 10000));

    functionName = "has-valid-license";
    functionArgs = [standardPrincipalCV(contractAddress)];

    transaction = makeContractCall(
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      feeRate,
      secretKey,
      {
        nonce: new BigNum(2),
        version: TransactionVersion.Testnet
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx3.bin", transaction.serialize());
  });
});
