;; A very simple escrow smart contract where funds are deposited
;; in the contract. After both buyer and seller agreed the funds
;; are transferred to the seller.
;;
;; For more details see docs/escrow.md

;; addresses of buyer, seller and escrow are hard-coded,
;; a new contract is needed for each deal
(define-constant buyer 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)
(define-constant seller 'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9)
(define-constant escrow 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.escrow)

;; storage
(define-data-var buyerOk bool false)
(define-data-var sellerOk bool false)
(define-data-var balance uint u0)

;; read-only functions
(define-read-only (get-info)
  {balance: (var-get balance), buyerOk: (var-get buyerOk), sellerOk: (var-get sellerOk)}
)

;; private functions

;; sends the deposited amount to seller or panics, e.g. if not enough funds
(define-private (payout-balance)
  (unwrap-panic (as-contract (stx-transfer? (var-get balance) escrow seller)))
)

;; panics if buyer and seller accepted already the deal
(define-private (if-deal-closed-then-panic)
  (unwrap-panic
    (if (and (var-get buyerOk) (var-get sellerOk))
      (err 1)
      (ok true)
    )
  )
)
;; public functions

;; buyer and seller have to agree to the deal before transferring funds
(define-public (accept)
  (begin
    ;; update acceptance flags
    (if (is-eq tx-sender buyer)
      (begin
        (var-set buyerOk true)
        (ok true)
      )
      (if (is-eq tx-sender seller)
        (begin
          (var-set sellerOk true)
          (ok true)
        )
        (ok false)
      )
    )
    ;; payout funds once buyer and seller accepted conditions
    (if (and (var-get buyerOk) (var-get sellerOk))
      (ok (payout-balance))
      (ok true)
    )
  )
)

;; everybody can deposit money to the escrow account
(define-public (deposit (amount uint))
  (begin
    (if-deal-closed-then-panic)
    (var-set balance (+ amount (var-get balance)))
    (stx-transfer? amount tx-sender escrow)
  )
)

;; if buyer or seller want to cancel they can do it at any time
(define-public (cancel)
  (begin
    (if-deal-closed-then-panic)
    (if (or (is-eq tx-sender buyer) (is-eq tx-sender seller))
      (print (as-contract (stx-transfer? (var-get balance) escrow buyer)))
      (ok false)
    )
  )
)
