const BigNum = require("bn.js");
import {
  makeContractCall,
  broadcastTransaction,
  bufferCVFromString,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const STACKS_API_URL = "http://127.0.0.1:20443";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

describe("status contract test suite", async () => {
  it("post and read a status", async () => {
    const transaction = await makeContractCall({
      contractAddress: "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6",
      contractName: "status",
      functionName: "write-status!",
      functionArgs: [bufferCVFromString("My name is Peter")],
      fee: new BigNum(183),
      senderKey:
        "f679bd39a4e66c78ed47ee0965a7b2d6be13bbbf1a6bcc4f5e73a3657d985fe401",
      nonce: new BigNum(2),
      network,
    });
    var result = await broadcastTransaction(transaction, network);
    console.log(result);
  });
});
