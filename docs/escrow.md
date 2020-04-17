# Escrow Contract - Or how to buy a raspberry pi

## Setup Testnet

```
git clone git@github.com:blockstack/stacks-blockchain.git
cd stacks-blockchain
cargo build
```

## Configure Testnet

Add stacks to your accounts

- seller: ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9 0x100 fees
- buyer: ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M 0x700 fees + price

```
cargo run --bin blockstack-cli generate-sk > keys.json
cargo run --bin blockstack-cli generate-sk > keys2.json

vi Stacks.toml
```

## Stacks Transaction library for Javascript

```
cd ..
git clone git@github.com:blockstack/stacks-blockchain.git
cd stacks-transactions-js
yarn
yarn build
yarn link
```

## Use Escrow Smart Contracts

1. Find out address of seller of raspberry pi (`ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9`)
1. Deposit STX for the price (0x10000)
1. Wait until the seller agrees to the deal (`accept`) and sends you the pi
1. Confirm the reception of the pi (`accept`)

```
cd ..
git clone git@github.com:friedger/clarity-smart-contracts.git
cd clarity-smart-contracts
yarn
yarn link @blockstack/stacks-transactions
yarn escrow
```
