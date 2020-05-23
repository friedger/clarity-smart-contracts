# Flip Coin

This contracts implements a read-only method that can be used by other contracts to get a boolean value at random. Each block a new random true or false value is created.

Users can bet 1000 mSTX on the outcome of that function, once for each block.

If the user was correct, the amount of 1000 mSTX is reimbursed.
If there was another user that bet on the reverse outcome then the winner gets 2000 mSTX.
If the user was incorrect and the only user for this block, the amount goes to the jackpot.

The next winner will receives the jackpot in addition to the usual payout.

Note, that users don't know whether another user has already bet on the given value, or on the reverse value. If another user bet already on that value the transaction will return an error. This gives an interesting twist to the game theory as blocks are produced quite fast on the Stacks blockchain.

## Testing

1. Clone this repo and install dependencies using `yarn`.
1. Launch mocknet with the configuration for keys.json and keys2.json not below these values:

```
[[mstx_balance]]
address = "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9"
amount = 1256

[[mstx_balance]]
address = "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M"
amount = 10256
```

1. Deploy contract (with keys.json) using `yarn mocha test/integration/flip-coin0.ts`.
1. Bet (with keys.json) using `yarn mocha test/integration/flip-coin1.ts`.
1. Check the result by editing `betAtHeight` (replace with the value returned by the previous transaction) and run ``yarn mocha test/integration/flip-coin-x.ts`. The output contains the random flip coin at the current block, the winner at the given block, the amount bet at the given block and the jackpot.
1. If user did not win bet until user won.
1. Check balance of user ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M (keys.json) by visiting `http://127.0.0.1:20443/v2/accounts/ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M`
1. Bet (with keys2.json) using `yarn mocha test/integration/flip-coin2.ts` to initiate payout.
1. Check balance of user ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M (keys.json) by visiting `http://127.0.0.1:20443/v2/accounts/ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M`

## Testing

Clarity VM tests do not support block data.
Running `yarn mocha test/unit/flip-coin.ts` fails.
