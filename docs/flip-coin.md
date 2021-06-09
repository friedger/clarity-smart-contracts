# Flip Coin

Flip coin is a set of four contracts: `flip-coin`, `flip-coin-tax-office`, `flip-coin-jackpot`. `flip-coin-at-two`.

The basis is the `flip-coin` contract that implements a read-only function returning a boolean value at random. Each block, a new random true-or-false value is created.

The `flip-coin-tax-office` defines a trait to pay taxes on gambling.

The two other contracts describe a betting game that make use of the `flip-coin` contract. The `flip-coin-at-two` contract transferres a tax fee to the `flip-coin-jackpot` contract to keep both games interesting for users. The games have a similar structure but use different payout methods. More details are described below.

## Testing Flip coin contract

1. Clone this repo and install dependencies using `yarn`.
1. For unit tests, run `yarn mocha test/unit/flip-coin.ts`.
1. For integration tests, launch mocknet with the configuration for keys.json and keys2.json not below these values (enough to also play some betting games):

```
[[mstx_balance]]
address = "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M"
amount = 10256

[[mstx_balance]]
address = "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9"
amount = 10256
```

1. Deploy contract (with keys.json) using `yarn mocha test/integration/flip-coin-deploy-all.ts`.
1. Run `yarn mocha test/integration/flip-coin-x.ts` and look at the first output. It is a representation for clarity value "true" (type = 3) or "false" (type = 4). A new value is calculated for each new block.

## Betting games using flip coin contract

There are two contracts using `flip-coin` to realize a betting game: `flip-coin-jackpot` and `flip-coin-at-two`.

### Flip Coin Betting with Jackpot

Users can bet 1000 uSTX on the outcome of that function, once for each block.

If the user was correct, the amount of 1000 uSTX is reimbursed.
If there was another user that bet on the reverse outcome then the winner gets 2000 uSTX.
If the user was incorrect and the only user for this block, the amount goes to the jackpot.

The next winner will receives the jackpot in addition to the usual payout.

Note, that users don't know whether another user has already bet on the given value, or on the reverse value. If another user bet already on that value the transaction will return an error. This gives an interesting twist to the game theory as blocks are produced quite fast on the Stacks blockchain.

The payout happens when another bet is placed.

### Flip Coin Betting against somebody else (at two players)

Users can bet 1000 uSTX on the outcome of that function. The bet is pending until another users bets against it. There can be only one pending bet at the time.

The user who was correct receives the amount of 1800 uSTX (1000 uSTX reimbursment + 800 uSTX from the other player, 10% are sent to the jackpot of the other game as a tax)

The payout happens when another bet is placed.

The first player finds the block height

### Bet via Speed Spent

A simple web UI allows to places bets at [Speed Spend](https://speed-spend.netlify.app).

When places at bet the transaction id is returned. This tx id is needed to determine the winner:

1. Find the block height of the bet at https://stacks-node-api.blockstack.org/extended/v1/tx/{txid} with the returned tx id.
1. Edit `tests/integration/flip-coin-x.ts` and replace the `betAtHeight` with the block height of the bet. Use an coreApiUrl of the testnet.
1. Run `yarn mocha tests/integration/flip-coin-x.ts` to see who won what prize.

### Testing betting games

1. Bet (with keys.json) using `yarn mocha test/integration/flip-coin1.ts`.
1. Check the result by editing `betAtHeight` (replace with the value returned by the previous transaction) and run `yarn mocha test/integration/flip-coin-x.ts`. The output contains the random flip coin at the current block, the winner at the given block, the amount bet at the given block and the jackpot.
1. If user did not win bet until user won.
1. Check balance of user ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M (keys.json) by visiting `http://127.0.0.1:20443/v2/accounts/ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M`
1. Bet (with keys2.json) using `yarn mocha test/integration/flip-coin2.ts` to initiate payout.
1. Check balance of user ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M (keys.json) by visiting `http://127.0.0.1:20443/v2/accounts/ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M`

## Limitations

- Clarity VM tests do not support block data. Therefore only the even function was tested.
- stacks-transactions do not support traits as arguments in contract calls. Therefore, the tax-office for the flip-coin-at-two contract uses the static contract call to flip-coin-jackpot.

## Future work

The two game contracts are linked via a tax-office trait. In the future, the tax-office could be changed based on different events or decisions.

The Web UI could be developed into an entertaining site.
