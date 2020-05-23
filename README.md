# Clarity Smart Contracts

A collection of various smart contracts written in Clarity. They run on the [Stacks blockchain](https://docs.blockstack.org).

See also [original Clarity tutorials](https://github.com/blockstack/clarity-js-sdk/tree/master/packages/clarity-tutorials) by Blockstack.

```
.
+-- contracts
|    +-- license (OI License - contract to handle licenses for using UI apps, not data apps)
|    +-- monsters (NFTs that can get disabled + market -- WIP)
|    +-- tokens  (Token contracts with various properties)
|    +-- experiments (All the rest)
+-- test
|    +-- integration (Tests that run on mocknet or testnet)
|    +-- unit (Test that run on clarity VM only)
```

## Documented Contracts

[Escrow contract](docs/escrow.md): Simple token transfer via 3rd party (contract account). [Video of demo](https://www.youtube.com/watch?v=uZH1V-FNJIs)

[Flip coin contract](docs/flip-coin.md): Random coin flipping, users can bet on the outcome.
