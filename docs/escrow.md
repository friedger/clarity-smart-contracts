# Escrow Contract - Or how to buy a raspberry pi

## Use Case

Let's imagine you want to buy a raspberry pi from an online shop you know vaguely. These are the steps to do:

1. Find out address of the online shop (in this demo it is `ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9`)
1. Deposit STX for the price (0x10000)
1. Wait until the seller agrees to the deal (`accept`) and sends you the pi
1. Confirm the reception of the pi (`accept`)

## Setup Mocknet

As the demo is about the testnet in mocknet mode (local mining without p2p) here is how to set it up:

```
git clone https://github.com/blockstack/stacks-blockchain.git
cd stacks-blockchain
cargo testnet mocknet
```

## Configure Mocknet

Add stacks to the accounts in the `testnet/stacks-node/Stacks.toml` configuration file, accounts are defined in `keys.json` and `keys2.json`

- for seller ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9: 0x100 fees
- for buyer ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M: 0x700 fees + price

In directory **stacks-blockchain**:

```
vi testnet/stacks-node/Stacks.toml
```

insert

```
[[mstx_balance]]
address = "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9"
amount = 256

[[mstx_balance]]
address = "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M"
amount = 67328
```

If you want to use your own keys do something like this:

```
cargo run --bin blockstack-cli generate-sk > keys.json
cargo run --bin blockstack-cli generate-sk > keys2.json
```

## Run Mocknet

In directory **stacks-blockchain**:

```
cargo testnet start --config=./testnet/stacks-node/Stacks.toml
```

## Use Escrow Smart Contracts

For the online deal we want to use the escrow contract.

Open a new terminal (or move to the parent directory of stacks-blockchain using `cd ..`)

```
git clone https://github.com/friedger/clarity-smart-contracts.git
cd clarity-smart-contracts
yarn
```

The demo was tested with **version 0.3.0-alpha.5** of `@blockstack/stacks-transaction` library.

Finally, run the sequence of transactions that are defined in the integration test script (`mocha` test):

```
yarn escrow
```

The test script contains calls of the following methods defined in the stacks-transaction library:

- `makeSmartContractDeploy`
- `makeContractCall`
- `makeStandardSTXPostCondition`
- `makeContractSTXPostCondition`

The buyer will deploy the contract, wait 10 seconds, deposit 65536 mSTXs. Then the seller will accept the deal. After another 10 seconds, the buyer will accept the deal and the price STXs will be transferred to the seller.

While the testnet is still running, you can check the balance of the buyer and the seller at
* [http://127.0.0.1:20443/v2/accounts/ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M](http://127.0.0.1:20443/v2/accounts/ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)
* [http://127.0.0.1:20443/v2/accounts/ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9](http://127.0.0.1:20443/v2/accounts/ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9)
