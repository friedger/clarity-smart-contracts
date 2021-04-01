//
// utils functions

import {
  broadcastTransaction,
  makeContractDeploy,
  StacksTransaction,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";
import * as fs from "fs";

import { ADDR1, testnetKeyMap } from "./mocknet";
import BN from "bn.js";
const fetch = require("node-fetch");

export const local = false;
export const mocknet = false;
export const noSidecar = false;

const STACKS_CORE_API_URL = local
  ? "http://localhost:3999"
  : "https://stacks-node-api.testnet.stacks.co";
const STACKS_API_URL = local
  ? "http://localhost:3999"
  : "https://stacks-node-api.testnet.stacks.co";
export const network = new StacksTestnet();
network.coreApiUrl = STACKS_CORE_API_URL;

const keys1 = JSON.parse(fs.readFileSync("keys.json").toString());
const keys2 = JSON.parse(fs.readFileSync("keys2.json").toString());

// private keys of users
const secretKey1 = keys1.secretKey;
export const secretKey2 = keys2.secretKey;

/* Replace with your private key for testnet deployment */

const keys = mocknet
  ? testnetKeyMap[ADDR1]
  : JSON.parse(
      fs
        .readFileSync("../../blockstack/stacks-blockchain/keychain2.json")
        .toString()
    );

export const secretKey = keys.private;
export const contractAddress = keys.stacks;
//
export async function handleTransaction(transaction: StacksTransaction) {
  const result = await broadcastTransaction(transaction, network);
  console.log(result);
  if ((result as TxBroadcastResultRejected).error) {
    if (
      (result as TxBroadcastResultRejected).reason === "ContractAlreadyExists"
    ) {
      console.log("already deployed");
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
  console.log(processed, result);
  return result as TxBroadcastResultOk;
}

export async function deployContract(
  contractName: string,
  options?: { path?: string; name?: string; replace?: (s: string) => string }
) {
  const path = options?.path || "experiments";
  const name = options?.name || contractName;
  const codeBody = fs
    .readFileSync(`./contracts/${path}/${name}.clar`)
    .toString();
  var transaction = await makeContractDeploy({
    contractName,
    codeBody: options?.replace ? options.replace(codeBody) : codeBody,
    senderKey: secretKey,
    network,
  });
  console.log(`deploy contract ${contractName}`);
  return handleTransaction(transaction);
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processing(tx: String, count: number = 0): Promise<boolean> {
  return noSidecar
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
  const url = `${STACKS_API_URL}/extended/v1/tx/${tx}`;
  var result = await fetch(url);
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

  if (mocknet) {
    await timeout(5000);
  } else {
    await timeout(50000);
  }
  return processing(tx, count + 1);
}
