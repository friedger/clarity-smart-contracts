(define-map offers ((bid-owner principal) (owner principal) (monster-id uint))
  ((price uint))
)

(define-constant err-invalid-offer-key u1)
(define-constant err-payment-failed u2)
(define-constant err-transfer-failed u3)

(define-private (get-monster-owner (monster-id uint))
  (contract-call? .monster owner-of? monster-id)
)

(define-private (transfer-monster-to-escrow (monster-id uint))
  (contract-call? .monster transfer monster-id (as-contract tx-sender))
)

;; called by the bidder ;-)
(define-public (bid (monster-id uint) (price uint))
  (let ((monster-owner (unwrap-panic (get-monster-owner monster-id))))
    (ok (map-insert offers {bid-owner: tx-sender, owner: monster-owner, monster-id: monster-id}
                {price: price}))
  )
)

;; called by the monster owner
(define-public (accept (monster-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, monster-id: monster-id})
    offer (transfer-monster-to-escrow monster-id)
    (err err-invalid-offer-key)
  )
)

;; called by the bidder
(define-public (pay (monster-id uint))
  (let (
      (owner (unwrap-panic (get-monster-owner monster-id)))
      (bid-owner tx-sender)
    )
    (let ((offer (unwrap-panic
          (map-get? offers {bid-owner: tx-sender, owner: owner, monster-id: monster-id}))))

      (match (stx-transfer?  (get price offer) tx-sender owner)
          success (match (as-contract (contract-call? .monster transfer monster-id bid-owner))
              transferred (begin
                (map-delete offers {bid-owner: tx-sender, owner: owner, monster-id: monster-id})
                (ok true)
               )
              error (err err-transfer-failed)
          )
        error (err err-payment-failed)
      )
    )
  )
)
