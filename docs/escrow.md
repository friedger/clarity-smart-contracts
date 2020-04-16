# Escrow Contract - Or how to buy a raspberry pi

## Setup Testnet

```
git clone git@github.com:blockstack/stacks-blockchain.git
cd stacks-blockchain
cargo build
```

## Configure Testnet

Add stacks to your accounts

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

## Smart Contracts

```
cd ..
git clone git@github.com:friedger/clarity-smart-contracts.git
cd clarity-smart-contracts
yarn
yarn link @blockstack/stacks-transactions
yarn escrow
```
