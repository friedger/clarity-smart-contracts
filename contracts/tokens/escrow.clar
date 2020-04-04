
(define-constant buyer 'ST12)
(define-constant seller 'ST)
(define-constant escrow 'S23)
(define-data-var buyerOk 'false)
(define-data-var sellerOk 'false)

(define-private (payout-balance))
(define-public (accept)
  (begin
    (if (is-eq tx-sender buyer)
      (var-set buyerOk 'true)
      (if (is-eq tx-sender seller)
        (var-set sellerOk 'true)
        'false
      )
    )
    (if (and (var-get buyerOk) (var-get sellerOk)
      (payout-balance)
      (if (and (var-get buyerOk) (not (var-get sellerOk) )))
    )
  )
)

(define-public deposit)
(define-public cancel)
(define pay-balance )

(begin
)
