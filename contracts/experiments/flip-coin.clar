;; A simple flip coin betting game.
;;
;; For more details see docs/flip-coin.md

;; storage
(define-map gamblers ((height uint) (value bool)) ((principal principal) (amount uint)))
(define-map amounts ((height uint)) ((amount uint)))

(define-data-var pending-payout (optional uint) none)
(define-data-var jackpot uint u0)

(define-constant err-bet-exists u10)
(define-constant even-buffer 0x00020406080a0c0e10121416181a1c1e20222426282a2c2e30323436383a3c3e40424446484a4c4e50525456585a5c5e60626466686a6c6e70727476787a7c7e80828486888a8c8e90929496989a9c9ea0a2a4a6a8aaacaeb0b2b4b6b8babcbec0c2c4c6c8caccced0d2d4d6d8dadcdee0e2e4e6e8eaecee)

;; private functions

;; used in (fold) to get last item of a buffer
(define-private (last (item (buff 1)) (value  (buff 1)))
   item
)

;; used in (fold) to check if character is even
(define-private (is-even (item (buff 1)) (value-tuple (tuple (value (buff 1)) (result (buff 1)))))
  (let ((val (get value value-tuple)))
    (if (is-eq item val )
      {value: val, result: 0x00}
      {value: val, result: (get result value-tuple)}
    )
  )
)

;; check whether the character is even
(define-private (even (value (buff 1)))
  (is-eq (get result (fold is-even even-buffer {value: value, result: 0x01})) 0x00)
)

;; flip coin by looking at the hash at the given block
;; returns true if the last byte of the hash is even
(define-private (flip-coin-at (height uint))
  (let ((hash (unwrap-panic (get-block-info? header-hash height))))
    (let ((last-value  (fold last hash "0")))
      (even last-value)
    )
  )
)

;; public functions

;; returns the random value based on the previous block
(define-read-only (flip-coin)
  (flip-coin-at (- block-height u1))
)

;; returns how much stx were bet at the given block
(define-read-only (get-jackpot)
  (var-get jackpot)
)

;; returns how much stx were bet at the given block
(define-read-only (get-amount-at (height uint))
  (match (map-get? amounts ((height height)))
    amount (get amount amount)
    u0
  )
)

;; returns the winner at the given block. If there was no winner `(none)` is returned
(define-read-only (get-optional-winner-at (height uint))
  (match (map-get? gamblers ((height height) (value (flip-coin-at (+ height u1)))))
    gambler (some (get principal gambler))
    none
  )
)

;; pays the bet amount at the given block plus the jackpot
(define-private (payout (height (optional uint)))
 (match height
  some-height (if (is-eq block-height some-height)
    true
    (begin
      (match (get-optional-winner-at some-height)
        winner (begin
          (unwrap-panic (print (as-contract (stx-transfer? (+ (var-get jackpot) (get-amount-at some-height)) tx-sender winner))))
          (var-set jackpot u0)
          )
        (var-set jackpot (+ (var-get jackpot) (get-amount-at some-height)))
      )
      (var-set pending-payout none)
    ))
  true
 )
)

;; bet 1000 mSTX on the given value. Only one user can bet on that value for each block.
;; if payout needs to be done then this function call will do it (note that the caller
;; needs to provide corresponding post conditions)
(define-public (bet (value bool))
  (let ((amount u1000))
    (begin
      (payout (var-get pending-payout))
      (if (map-insert gamblers ((height block-height) (value value)) ((amount amount) (principal tx-sender)))
        (match (stx-transfer? amount tx-sender (as-contract tx-sender))
          success (begin
            (map-set amounts ((height block-height))  ((amount (+ (get-amount-at block-height) amount))))
            (var-set pending-payout (some block-height))
            (ok block-height)
          )
          error (err error)
        )
        (err err-bet-exists)
      )
    )
  )
)
