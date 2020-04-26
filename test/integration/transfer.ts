const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,
  uintCV,
  ChainID,
} from "@blockstack/stacks-transactions";
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  makeSTXTokenTransfer,
} from "@blockstack/stacks-transactions/lib/src/builders";

const STACKS_API_URL = "http://127.0.0.1:20443/v2/transactions";

describe("transfer test suite", async () => {
  it("should deposit and payout balance", async () => {
    const keysBuyer = JSON.parse(fs.readFileSync("./keys.json").toString());

    const transaction = makeSTXTokenTransfer(
      "ST1T220B88WSF0ZYNS8V7B33DCZEY23FY7V83GDW",
      new BigNum(1000),
      new BigNum(1000),
      "994d526b3b3409def4d3e481f9c4b3debaf9535cffed0769a7543601e1efa3c501",
      {
        nonce: new BigNum(0),
        version: TransactionVersion.Testnet,
        chainId: ChainID.Testnet,
        postConditions: [
          makeStandardSTXPostCondition(
            "ST2P4S7Q4PHGQE9VGG6X8Z54MQQMN1E5047ZHVAF7",
            FungibleConditionCode.Less,
            new BigNum(2000)
          ),
        ],
      }
    );
    console.log(transaction.serialize().toString("hex"));
    const broadcastResult = await transaction.broadcast(
      "http://neon.blockstack.org:20443"
    );

    // "8dd1d5a6d21600c9d75d409e61b866eea8061fb09577b087b44b8b3870360fd401",
    // ST200ZD1N2TWNJNTEN9WQ4R3R24ZX2FYAX879E3PZ
    const t = makeSTXTokenTransfer(
      "ST200ZD1N2TWNJNTEN9WQ4R3R24ZX2FYAX879E3PZ",
      new BigNum(10),
      new BigNum(212),
      "994d526b3b3409def4d3e481f9c4b3debaf9535cffed0769a7543601e1efa3c501",
      {
        nonce: new BigNum(1),
        chainId: ChainID.Testnet,
        version: TransactionVersion.Testnet,
        postConditions: [
          makeStandardSTXPostCondition(
            "ST2P4S7Q4PHGQE9VGG6X8Z54MQQMN1E5047ZHVAF7",
            FungibleConditionCode.Less,
            new BigNum(300)
          ),
        ],
      }
    );
    console.log(await t.broadcast(STACKS_API_URL));
    return;
  });
});
