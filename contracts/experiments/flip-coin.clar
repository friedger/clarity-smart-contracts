;; A simple flip coin contract
;; used in betting game contracts flip-coin-at-two and flip-coin-jackpot
;;
;; For more details see docs/flip-coin.md

;; buffer of all even characters
(define-constant even-buffer 0x00020406080a0c0e10121416181a1c1e20222426282a2c2e30323436383a3c3e40424446484a4c4e50525456585a5c5e60626466686a6c6e70727476787a7c7e80828486888a8c8e90929496989a9c9ea0a2a4a6a8aaacaeb0b2b4b6b8babcbec0c2c4c6c8caccced0d2d4d6d8dadcdee0e2e4e6e8eaecee)
(define-constant zero 0x00)

;; private functions

;; used in (fold) to get last item of a buffer
(define-private (last (item (buff 1)) (value  (buff 1)))
   item
)

;; used in (fold) to check if character is even
(define-private (is-even (item (buff 1)) (state {value: (buff 1), result: bool}))
  (let ((val (get value state)))
    (if (is-eq item val )
      {value: val, result: true}
      state
    )
  )
)

;; public functions

;; check whether the character is even
(define-read-only (even (value (buff 1)))
  (get result (fold is-even even-buffer {value: value, result: false}))
)

;; checks property of last byte of given buffer
;; returns true if the last byte of the hash is even
(define-read-only (is-last-even (hash (buff 32)) )
  (let ((last-value  (fold last hash zero)))
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

