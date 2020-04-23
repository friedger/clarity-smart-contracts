(define-map monsters ((monster-id uint))
  ((name (buff 20))
  (last-meal uint))
)

(define-non-fungible-token nft-monsters uint)
(define-data-var next-id uint u1)
(define-constant hunger-tolerance u6) ;; 6 blocks a 10 seconds

(define-constant err-monster-unborn u1)
(define-constant err-monster-exists u2)
(define-constant err-monster-died u3)
(define-constant err-transfer-not-allowed u4)

(define-private (is-last-meal-young (last-meal uint))
  (> (to-int last-meal) (to-int (- burn-block-height hunger-tolerance)))
)

(define-public (create-monster (name (buff 20)))
    (let ((monster-id (var-get next-id)))
      (if (is-ok (nft-mint? nft-monsters monster-id tx-sender))
        (begin
          (var-set next-id (+ monster-id u1))
          (map-set monsters {monster-id monster-id}
          {
            name name
            last-meal burn-block-height
          })
          (ok monster-id)
        )
        (err err-monster-exists)
    )
  )
)

(define-public (feed-monster (monster-id uint))
  (match (map-get? monsters {monster-id monster-id})
    monster (begin
        (if (is-last-meal-young (get last-meal monster))
          (begin
            (map-set monsters {monster-id monster-id} {
              name (get name monster)
              last-meal burn-block-height})
            (ok burn-block-height)
          )
          (err err-monster-died)
        )
      )
    (err err-monster-unborn)
  )
)

(define-public (transfer ((monster-id uint) (receipient principal)))
  (let ((owner (unwrap! (owner-of? monster-id) (err err-monster-unborn))))
    (if (eq owner tx-sender)
      (nft-transfer? nft-monsters monster-id tx-sender recipient)
      (err err-transfer-not-allowed)
    )
  )
)

(define-read-only (owner-of? (monster-id uint))
  (nft-get-owner? nft-monsters monster-id)
)

(define-read-only (is-alive (monster-id uint))
  (match (map-get? monsters {monster-id monster-id})
    monster (ok (is-last-meal-young (get last-meal monster)))
    (err err-monster-unborn)
  )
)

