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
  standardPrincipalCV,
  serializeCV,
  deserializeCV,
} from "@blockstack/stacks-transactions";
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:20443/v2/transactions";

describe("status contract test suite", async () => {
  it("read a status", async () => {
    console.log(
      serializeCV(
        standardPrincipalCV("ST3KC0MTNW34S1ZXD36JYKFD3JJMWA01M55DSJ4JE")
      ).toString("hex")
    );
    console.log(serializeCV(bufferCV(Buffer.from("My name is Peter"))));
    console.log(
      deserializeCV(
        Buffer.from("02000000104d79206e616d65206973205065746572", "hex")
      )
    );
    const transaction = makeContractCall(
      "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6",
      "status",
      "get-status!",
      [standardPrincipalCV("ST3ZYW7RPYRKHHFC2YCP2CDZC52NSRQZ0HRXQ587G")],
      new BigNum(182),
      "f679bd39a4e66c78ed47ee0965a7b2d6be13bbbf1a6bcc4f5e73a3657d985fe401",
      {
        nonce: new BigNum(3),
        version: TransactionVersion.Testnet,
        chainId: ChainID.Testnet,
      }
    );
    //console.log(await transaction.broadcast(STACKS_API_URL));
  });
});
