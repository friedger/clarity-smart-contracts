const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  standardPrincipalCV,
} from "@blockstack/stacks-transactions";
import { makeStandardSTXPostCondition } from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:9000/v2/transactions";

describe("oi license contract test suite", async () => {
  it("should buy a non-expiring license", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());

    let contractName = "oi-license";
    let code = fs.readFileSync("./contracts/license/license.clar").toString();

    let feeRate = new BigNum(3000);
    let secretKey = keys.secretKey;
    let secretKey2 = keys2.secretKey;

    let transaction = makeSmartContractDeploy(
      contractName,
      code,
      feeRate,
      secretKey,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
      }
    );
    fs.writeFileSync("mempool/tx1.bin", transaction.serialize());
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "buy-non-expiring";
    var functionArgs = [];

    transaction = makeContractCall(
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      feeRate,
      secretKey2,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeStandardSTXPostCondition(
            keys2.stacksAddress,
            FungibleConditionCode.GreaterEqual,
            new BigNum(55)
          ),
        ],
      }
    );

    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    functionName = "has-valid-license";
    functionArgs = [standardPrincipalCV(keys2.stacksAddress)];

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
      }
    );

    fs.writeFileSync("mempool/tx3.bin", transaction.serialize());
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
