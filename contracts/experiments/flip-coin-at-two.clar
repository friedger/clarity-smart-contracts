;; A simple betting game using flip-coin with player matching
;;
;; For more details see docs/flip-coin.md

;;
;; Flip coin contract
;;

(define-constant even-buffer 0x00020406080a0c0e10121416181a1c1e20222426282a2c2e30323436383a3c3e40424446484a4c4e50525456585a5c5e60626466686a6c6e70727476787a7c7e80828486888a8c8e90929496989a9c9ea0a2a4a6a8aaacaeb0b2b4b6b8babcbec0c2c4c6c8caccced0d2d4d6d8dadcdee0e2e4e6e8eaecee)

;; private functions

;; used in (fold) to get last item of a buffer
(define-private (last (item (buff 1)) (value  (buff 1)))
   item
)

;; used in (fold) to check if character is even
(define-private (is-even (item (buff 1)) (value-tuple {value: (buff 1), result: (buff 1)}))
  (let ((val (get value value-tuple)))
    (if (is-eq item val )
      {value: val, result: 0x00}
      {value: val, result: (get result value-tuple)}
    )
  )
)

;; public functions

;; check whether the character is even
(define-read-only (even (value (buff 1)))
  (is-eq (get result (fold is-even even-buffer {value: value, result: 0x01})) 0x00)
)

;; checks property of last byte of given buffer
;; returns true if the last byte of the hash is even
(define-read-only (is-last-even (hash (buff 32)) )
  (let ((last-value  (fold last hash "0")))
    (even last-value)
  )
)

;; flip coin by looking at the hash at the given block
;; returns true if the last byte of the hash is even
(define-read-only (flip-coin-at (height uint))
  (let ((hash (unwrap-panic (get-block-info? header-hash height))))
    (is-last-even hash)
  )
)


;; returns the random value based on the previous block
(define-read-only (flip-coin)
  (flip-coin-at (- block-height u1))
)

;;
;; Betting Game contract
;;

(define-constant default-amount u1000)
(define-constant new-slot {bet-true: none, bet-false: none, amount: default-amount, created-at: u0})
(define-constant err-bet-exists u10)

;; storage
(define-map gamblers ((height uint)) ((bet-true principal) (bet-false principal)))
(define-map amounts ((height uint)) ((amount uint)))
(define-map matched-bets ((created-at uint)) ((height uint)))

(define-data-var pending-payout (optional uint) none)
(define-data-var next-slot {bet-true: (optional principal), bet-false: (optional principal),
  amount: uint, created-at: uint}
  new-slot)

;; returns how much stx were bet at the given block
(define-read-only (get-amount-at (height uint))
  (match (map-get? amounts ((height height)))
    amount (get amount amount)
    u0
  )
)

;; returns the winner at the given block. If there was no winner `(none)` is returned
(define-read-only (get-optional-winner-at (height uint))
  (match (map-get? gamblers ((height height)))
    game-slot  (if (flip-coin-at (+ height u1))
                  (some (get bet-true game-slot))
                  (some (get bet-false game-slot))
                )
    none
  )
)

;; pays the bet amount at the given block
(define-private (payout (height (optional uint)))
 (match height
  some-height (if (is-eq block-height some-height)
    true
    (begin
      (unwrap-panic (print (as-contract (stx-transfer? (get-amount-at some-height) tx-sender (unwrap-panic (get-optional-winner-at some-height))))))
      (var-set pending-payout none)
    ))
  true
 )
)

(define-private (next-gambler (value bool))
  (if value
        (get bet-true (var-get next-slot))
        (get bet-false (var-get next-slot))
  )
)

(define-data-var trigger (optional uint) none)
(define-private (panic)
  (ok {created-at: (unwrap-panic (var-get trigger)), bet-at: u0})
)

(define-private (update-game-after-payment (value bool) (amount uint))
  (match (next-gambler (not value))
    opponent (if (map-insert gamblers ((height block-height))
                    {
                      bet-true: (if value tx-sender opponent),
                      bet-false: (if value opponent tx-sender)
                    }
                  )
                  (if (map-insert amounts ((height block-height))  ((amount (+ amount amount))))
                    (begin
                      (map-insert matched-bets {created-at: (get created-at (var-get next-slot))} {height: block-height})
                      (var-set next-slot new-slot)
                      (var-set pending-payout (some block-height))
                      (ok {
                            created-at: (get created-at (var-get next-slot)),
                            bet-at: block-height
                          })
                    )
                    (panic)
                  )
                (panic)
              )
    (begin
      (var-set next-slot {
        bet-true: (if value (some tx-sender) none),
        bet-false: (if value none (some tx-sender)),
        created-at: block-height,
        amount: amount
        })
      (ok {created-at: block-height, bet-at: u0})
    )
  )
)

;; bet 1000 mSTX on the given value. Only one user can bet on that value for each block.
;; if payout needs to be done then this function call will do it (note that the caller
;; needs to provide corresponding post conditions)
(define-public (bet (value bool))
  (let ((amount default-amount))
    (begin
      (payout (var-get pending-payout))
      (if (is-some (next-gambler value))
        (err err-bet-exists)
        (begin
          (match (stx-transfer? amount tx-sender (as-contract tx-sender))
            success (update-game-after-payment value amount)
            error (err error)
          )
        )
      )
    )
  )
)
