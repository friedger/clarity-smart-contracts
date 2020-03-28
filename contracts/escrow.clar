
(define buyer 0)
(define seller 0)
(define escrow 0)
(define buyerOk )
(define sellerOk )

(define-public (accept)
  (if (eq? tx-sender buyer)
    (ok (var-set buyerOk 'true))
    (if (eq? tx-sender seller)
     (ok (var-set sellerOk 'true))
     (err )
    )
  )
)
(define-public deposit)
(define-public cancel)
(define pay-balance )

(begin
)
