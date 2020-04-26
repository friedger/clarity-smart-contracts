const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  uintCV,
  ChainID,
  bufferCV,
} from "@blockstack/stacks-transactions";
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:20443/v2/transactions";

describe("status contract test suite", async () => {
  it("post and read a status", async () => {
    const transaction = makeContractCall(
      "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6",
      "status",
      "write-status!",
      [bufferCV(new Buffer("My name is Peter"))],
      new BigNum(183),
      "f679bd39a4e66c78ed47ee0965a7b2d6be13bbbf1a6bcc4f5e73a3657d985fe401",
      {
        nonce: new BigNum(2),
        version: TransactionVersion.Testnet,
        chainId: ChainID.Testnet,
      }
    );
    var result = await transaction.broadcast(STACKS_API_URL);
    console.log(result);
  });
});
