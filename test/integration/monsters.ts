const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  bufferCV,
  ChainID,
} from "@blockstack/stacks-transactions";

const STACKS_API_URL = "http://127.0.0.1:20443/v2/transactions";

describe("monster contract test suite", async () => {
  it("should create and feed a monster", async () => {
    const keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    const keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());

    const contractAddress = keys.stacksAddress;
    const contractName = "monsters";
    const code = fs
      .readFileSync("./contracts/monsters/monsters.clar")
      .toString();

    const secretKey = keys.secretKey;
    const secretKey2 = keys2.secretKey;

    var transaction = makeSmartContractDeploy(
      contractName,
      code,
      new BigNum(2139),
      secretKey,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
        chainId: ChainID.Testnet,
      }
    );
    console.log("deploy contract");
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    await new Promise((r) => setTimeout(r, 10000));

    console.log("create");

    transaction = makeContractCall(
      contractAddress,
      contractName,
      "create",
      [bufferCV(new Buffer("Black Tiger"))],
      new BigNum(250),
      secretKey,
      {
        nonce: new BigNum(1),
        version: TransactionVersion.Testnet,
        chainId: ChainID.Testnet,
      }
    );
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);

    console.log("feed monster");
    transaction = makeContractCall(
      contractAddress,
      contractName,
      "feed-monster",
      [],
      new BigNum(250),
      secretKey2,
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
        chainId: ChainID.Testnet,
      }
    );

    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
    await new Promise((r) => setTimeout(r, 10000));

    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
