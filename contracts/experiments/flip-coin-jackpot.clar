;; A simple flip coin betting game.
;;
;; For more details see docs/flip-coin.md

;; in the future the amount can be chosen by users
(define-constant default-amount u1000)
(define-constant err-bet-exists u10)
(define-constant err-flip-failed u11)

;; storage
(define-map gamblers (tuple (height uint) (value bool)) (tuple (principal principal) (amount uint)))
(define-map amounts (tuple (height uint)) (tuple (amount uint)))

(define-data-var pending-payout (optional uint) none)
(define-data-var jackpot uint u0)


;; public functions

;; returns how much stx were bet at the given block
(define-read-only (get-jackpot)
  (match (var-get pending-payout)
    height (match (get-optional-winner-at height)
              winner u0
              (+ (var-get jackpot) (get-amount-at height))
           )
    (var-get jackpot)
  )
)

;; returns how much stx were bet at the given block
(define-read-only (get-amount-at (height uint))
  (match (map-get? amounts {height: height})
    amount (get amount amount)
    u0
  )
)

;; returns the winner at the given block. If there was no winner `(none)` is returned
(define-read-only (get-optional-winner-at (height uint))
  (let ((value (contract-call? .flip-coin flip-coin-at (+ height u1))))
    (match (map-get? gamblers {height: height, value: value})
      gambler (some (get principal gambler))
      none
    )
  )
)

;; pays the bet amount at the given block plus the jackpot
(define-private (payout (height (optional uint)))
 (match height
  some-height (if (<= block-height some-height)
    true
    (begin
      (match (get-optional-winner-at some-height)
        winner (begin
          (unwrap-panic (as-contract (stx-transfer? (+ (var-get jackpot) (get-amount-at some-height)) tx-sender winner)))
          (var-set jackpot u0)
          )
        (var-set jackpot (+ (var-get jackpot) (get-amount-at some-height)))
      )
      (var-set pending-payout none)
    ))
  true
 )
)

(define-private (update-game-after-payment (value bool) (amount uint))
  (begin
    (map-set amounts {height: block-height}  {amount: (+ (get-amount-at block-height) amount)})
    (var-set pending-payout (some block-height))
    (ok block-height)
  )
)

;; bet 1000 uSTX on the given value. Only one user can bet on that value for each block.
;; if payout needs to be done then this function call will do it (note that the caller
;; needs to provide corresponding post conditions)
(define-public (bet (value bool))
  (let ((amount default-amount))
    (begin
      (payout (var-get pending-payout))
      (if (map-insert gamblers {height: block-height, value: value} {amount: amount, principal: tx-sender})
        (match (stx-transfer? amount tx-sender (as-contract tx-sender))
          success (update-game-after-payment value amount)
          error (err error)
        )
        (err err-bet-exists)
      )
    )
  )
)

(define-private (hodl-check)
  ;; (< u1000 (contract-call? ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.hodl-token hodl-balance-of tx-sender))
  true
)

(impl-trait .flip-coin-tax-office.tax-office-trait)

(define-public (pay-tax (amount uint))
  (begin
    (var-set jackpot (+ (var-get jackpot) amount))
    (stx-transfer? amount tx-sender (as-contract tx-sender))
  )
)
