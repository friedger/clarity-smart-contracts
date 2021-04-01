import {
  broadcastTransaction,
  bufferCV,
  bufferCVFromString,
  makeContractCall,
  StacksTransaction,
  tupleCV,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
  uintCV,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const fetch = require("node-fetch");
import * as fs from "fs";

const local = false;
const mocknet = false;

const STACKS_CORE_URL = local
  ? "http://localhost:20443"
  : "https://stacks-node-api.testnet.stacks.co/";
const STACKS_API_URL = local
  ? "http://localhost:3999"
  : "https://stacks-node-api.testnet.stacks.co";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

const keys1 = JSON.parse(fs.readFileSync("keys.json").toString());
const keys2 = JSON.parse(fs.readFileSync("keys2.json").toString());

// private keys of users
const secretKey1 = keys1.secretKey;
const secretKey2 = keys2.secretKey;

/* Replace with your private key for testnet deployment */

const keys = mocknet
  ? undefined
  : JSON.parse(
      fs
        .readFileSync("../../blockstack/stacks-blockchain/keychain.json")
        .toString()
    ).paymentKeyInfo;

const secretKey = keys ? keys.privateKey : keys1.secretKey;
const contractAddress = keys ? keys.address.STACKS : keys1.stacksAddress;

// get hash
const c32 = require("c32check");
const hash = c32.c32addressDecode(contractAddress)[1];
console.log(hash);

//
// utils functions
//
async function handleTransaction(transaction: StacksTransaction) {
  const result = await broadcastTransaction(transaction, network);
  if ((result as TxBroadcastResultRejected).error) {
    if (
      (result as TxBroadcastResultRejected).reason === "ContractAlreadyExists"
    ) {
      return "" as TxBroadcastResultOk;
    } else {
      throw new Error(
        `failed to handle transaction ${transaction.txid()}: ${JSON.stringify(
          result
        )}`
      );
    }
  }
  const processed = await processing(result as TxBroadcastResultOk);
  if (!processed) {
    throw new Error(
      `failed to process transaction ${transaction.txid}: transaction not found`
    );
  }
  return result as TxBroadcastResultOk;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processing(tx: String, count: number = 0): Promise<boolean> {
  return mocknet
    ? processingWithoutSidecar(tx, count)
    : processingWithSidecar(tx, count);
}

async function processingWithoutSidecar(
  tx: String,
  count: number = 0
): Promise<boolean> {
  await timeout(10000);
  return true;
}

async function processingWithSidecar(
  tx: String,
  count: number = 0
): Promise<boolean> {
  var result = await fetch(
    `${STACKS_API_URL}/extended/v1/tx/${tx.substr(1, tx.length - 2)}`
  );
  var value = await result.json();
  console.log(count);
  if (value.tx_status === "success") {
    console.log(`transaction ${tx} processed`);
    console.log(value);
    return true;
  }
  if (value.tx_status === "pending") {
    console.log(value);
  } else if (count === 10) {
    console.log(value);
  }

  if (count > 30) {
    console.log("failed after 30 trials");
    console.log(value);
    return false;
  }

  await timeout(50000);
  return processing(tx, count + 1);
}

//
// DO THE STACKING
//
async function doStacking() {
  console.log("do stacking");

  const transaction = await makeContractCall({
    contractAddress: "ST000000000000000000002AMW42H",
    contractName: "pox",
    functionName: "stack-stx",
    functionArgs: [
      uintCV(2000999994411),
      tupleCV({
        hashbytes: bufferCV(Buffer.from(hash, "hex")),
        version: bufferCV(Buffer.from("00", "hex")),
      }),
      uintCV(12),
    ],
    senderKey: secretKey,
    network,
  });

  return handleTransaction(transaction);
}

(async () => {
  doStacking();
})();
