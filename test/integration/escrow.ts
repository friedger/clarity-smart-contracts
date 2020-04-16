const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  standardPrincipalCV,
  uintCV,
} from "@blockstack/stacks-transactions";
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:9000/v2/transactions";

describe("escrow contract test suite", async () => {
  it("should deposit and payout balance", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());

    var contractAddress = keys.stacksAddress;
    let contractName = "escrow";
    let code = fs.readFileSync("./contracts/tokens/escrow.clar").toString();

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
    console.log("deploy contract");
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "deposit",
      [uintCV(10)],
      feeRate,
      secretKey,
      {
        nonce: new BigNum(1),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeStandardSTXPostCondition(
            keys.stacksAddress,
            FungibleConditionCode.Equal,
            new BigNum(10)
          ),
        ],
      }
    );

    console.log("deposit");
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "accept",
      [],
      feeRate,
      secretKey2,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeContractSTXPostCondition(
            contractAddress,
            "escrow",
            FungibleConditionCode.LessEqual,
            new BigNum(10)
          ),
        ],
      }
    );

    console.log("accept seller");
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "accept",
      [],
      feeRate,
      secretKey,
      {
        nonce: new BigNum(2),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeContractSTXPostCondition(
            contractAddress,
            "escrow",
            FungibleConditionCode.LessEqual,
            new BigNum(10)
          ),
        ],
      }
    );
    console.log("accept buyer");
    result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
