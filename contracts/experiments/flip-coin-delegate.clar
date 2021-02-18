;; A simple flip coin contract
;; used in betting games flip-coin-at-two and flip-coin-jackpot
;;
;; For more details see docs/flip-coin.md

(define-read-only (flip-coin-delegate)
 (contract-call? .flip-coin even 0x0b)
)
