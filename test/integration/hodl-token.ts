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
  makeStandardFungiblePostCondition,
  makeContractFungiblePostCondition,
} from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:9000/v2/transactions";

describe("hold token test suite", async () => {
  it("should buy and hold tokens", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let secretKey = keys.secretKey;
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    let secretKey2 = keys2.secretKey;

    let contractName = "hodl-token";
    var contractAddress = keys.stacksAddress;

    let code = fs.readFileSync("./contracts/tokens/hodl-token.clar").toString();

    let feeRate = new BigNum(2000);

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

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "hodl",
      [uintCV(5)],
      feeRate,
      secretKey,
      {
        nonce: new BigNum(1),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeContractFungiblePostCondition(
            "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
            "hodl-token",
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
    result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

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
    result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "unhodl",
      [uintCV(3)],
      feeRate,
      secretKey,
      {
        nonce: new BigNum(2),
        version: TransactionVersion.Testnet,
        postConditions: [
          makeContractFungiblePostCondition(
            "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
            "hodl-token",
            FungibleConditionCode.Equal,
            new BigNum(3),
            new AssetInfo(contractAddress, "hodl-token", "spendable-token")
          ),
          makeStandardFungiblePostCondition(
            contractAddress,
            FungibleConditionCode.Equal,
            new BigNum(3),
            new AssetInfo(contractAddress, "hodl-token", "hodl-token")
          ),
        ],
      }
    );

    console.log(transaction.serialize().toString("hex"));
    fs.writeFileSync("mempool/tx4.bin", transaction.serialize());
    result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
