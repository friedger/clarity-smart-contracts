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
import {
  makeStandardSTXPostCondition,
  makeStandardFungiblePostCondition,
} from "@blockstack/stacks-transactions/lib/src/builders";

describe("hold token test suite", async () => {
  it("should buy and hold tokens", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());

    let contractName = "hodl-token";
    let code = fs.readFileSync("./contracts/tokens/hodl-token.clar").toString();

    let feeRate = new BigNum(0);
    let secretKey = keys.secretKey;

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
            contractAddress,
            FungibleConditionCode.GreaterEqual,
            new BigNum(55),
            new AssetInfo(contractAddress, "hold-token", "hold-token")
          ),
          makeStandardFungiblePostCondition(
            contractAddress,
            FungibleConditionCode.GreaterEqual,
            new BigNum(55),
            new AssetInfo(contractAddress, "hold-token", "spendable-token")
          ),
        ],
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx2.bin", transaction.serialize());
  });
});
