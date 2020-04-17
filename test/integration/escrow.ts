const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  uintCV,
} from "@blockstack/stacks-transactions";
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:9000/v2/transactions";

describe("escrow contract test suite", async () => {
  it("should deposit and payout balance", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());
    const keysSeller = JSON.parse(fs.readFileSync("./keys2.json").toString());

    const contractAddress = keysBuyer.stacksAddress;
    const contractName = "escrow";
    const code = fs.readFileSync("./contracts/tokens/escrow.clar").toString();

    const price = 0x10000;

    var feeRate = new BigNum(1280);
    const secretKeyBuyer = keysBuyer.secretKey;
    const secretKeySeller = keysSeller.secretKey;

    var transaction = makeSmartContractDeploy(
      contractName,
      code,
      feeRate,
      secretKeyBuyer,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
      }
    );
    console.log("deploy contract");
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    console.log("deposit");
    feeRate = new BigNum(256);

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "deposit",
      [uintCV(price)],
      feeRate,
      secretKeyBuyer,
      {
        nonce: new BigNum(1),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeStandardSTXPostCondition(
            keysBuyer.stacksAddress,
            FungibleConditionCode.Equal,
            new BigNum(price)
          ),
        ],
      }
    );
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    console.log("accept seller");
    transaction = makeContractCall(
      contractAddress,
      contractName,
      "accept",
      [],
      feeRate,
      secretKeySeller,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
      }
    );

    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    console.log("accept buyer");
    transaction = makeContractCall(
      contractAddress,
      contractName,
      "accept",
      [],
      feeRate,
      secretKeyBuyer,
      {
        nonce: new BigNum(2),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeContractSTXPostCondition(
            contractAddress,
            "escrow",
            FungibleConditionCode.LessEqual,
            new BigNum(price)
          ),
        ],
      }
    );
    result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
