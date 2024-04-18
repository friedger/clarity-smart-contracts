const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeContractCall,
  bufferCV,
  standardPrincipalCV,
  serializeCV,
  deserializeCV,
  broadcastTransaction,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

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
    const transaction = await makeContractCall({
      contractAddress: "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6",
      contractName: "status",
      functionName: "get-status!",
      functionArgs: [
        standardPrincipalCV("ST3ZYW7RPYRKHHFC2YCP2CDZC52NSRQZ0HRXQ587G"),
      ],
      fee: new BigNum(182),
      senderKey:
        "f679bd39a4e66c78ed47ee0965a7b2d6be13bbbf1a6bcc4f5e73a3657d985fe401",
      nonce: new BigNum(3),
      network,
    });
    console.log(await broadcastTransaction(transaction, network));
  });
});
