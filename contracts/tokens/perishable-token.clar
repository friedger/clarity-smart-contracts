(define-map tokens {token-id: uint} {last-tick: uint})

(define-non-fungible-token perishable-token uint)
(define-data-var next-id uint u1)

(define-constant time-to-perish u6)

(define-constant err-invalid-token-id u1)
(define-constant err-token-exists u2)
(define-constant err-token-perished u3)

(define-private (is-last-tick-young (last-tick uint))
  (> (to-int last-tick) (to-int (- burn-block-height time-to-perish)))
)

(define-public (mint)
    (let ((token-id (var-get next-id)))
      (if (is-ok (nft-mint? perishable-token token-id tx-sender))
        (begin
          (var-set next-id (+ token-id u1))
          (map-set tokens {token-id : token-id}
          {last-tick : burn-block-height})
          (ok token-id)
        )
        (err err-token-exists)
    )
  )
)

(define-public (tick (token-id uint))
  (match (map-get? tokens {token-id : token-id})
    token (begin
        (if (is-last-tick-young (get last-tick token))
          (begin
            (map-set tokens {token-id : token-id} {
              last-tick: burn-block-height})
            (ok burn-block-height)
          )
          (err err-token-perished)
        )
      )
    (err err-invalid-token-id)
  )
)

(define-read-only (owner-of (token-id uint))
  (nft-get-owner? perishable-token token-id)
)

(define-read-only (perished (token-id uint))
  (match (map-get? tokens {token-id: token-id})
    token (ok (not (is-last-tick-young (get last-tick token))))
    (err err-invalid-token-id)
  )
)

