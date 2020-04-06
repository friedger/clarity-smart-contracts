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

describe("hold token test suite", async () => {
  it("should buy and hold tokens", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let secretKey = keys.secretKey;
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    let secretKey2 = keys2.secretKey;

    let contractName = "hodl-token";
    let code = fs.readFileSync("./contracts/tokens/hodl-token.clar").toString();

    let feeRate = new BigNum(0);

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

    await new Promise((r) => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "hodl";
    var functionArgs = [uintCV(5)];

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
            "ST100000000000000000000000000000001YKQJ4P",
            FungibleConditionCode.Equal,
            new BigNum(5),
            new AssetInfo(contractAddress, "hodl-token", "hodl-token")
          ),
          makeStandardFungiblePostCondition(
            contractAddress,
            FungibleConditionCode.Equal,
            new BigNum(5),
            new AssetInfo(contractAddress, "hodl-token", "spendable-token")
          ),
        ],
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());

    await new Promise((r) => setTimeout(r, 10000));

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "hodl-balance-of",
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
  });
});
