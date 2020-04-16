const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  standardPrincipalCV,
  AssetInfo,
  uintCV,
} from "@blockstack/stacks-transactions";
import { makeStandardFungiblePostCondition } from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:9000/v2/transactions";

describe("fungible token test suite", async () => {
  it("should buy and hold tokens", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let secretKey = keys.secretKey;
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    let secretKey2 = keys2.secretKey;

    let contractName = "fungible-token";
    let code = fs
      .readFileSync("./contracts/tokens/fungible-token.clar")
      .toString();

    let feeRate = new BigNum(5000);

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
    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx1.bin", transaction.serialize());
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "transfer-token";
    var functionArgs = [uintCV(5), standardPrincipalCV(keys2.stacksAddress)];

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
          makeStandardFungiblePostCondition(
            keys.stacksAddress,
            FungibleConditionCode.Equal,
            new BigNum(5),
            new AssetInfo(contractAddress, contractName, "fungible-token")
          ),
        ],
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());
    var result = await transaction.broadcast(STACKS_API_URL);

    await new Promise((r) => setTimeout(r, 10000));

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "balance-of",
      [standardPrincipalCV(keys.stacksAddress)],
      feeRate,
      secretKey2,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx3.bin", transaction.serialize());
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
