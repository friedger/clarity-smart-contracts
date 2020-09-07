;; Simple Token that users can hodl

(define-fungible-token spendable-token u1000000)
(define-fungible-token hodl-token u1000000)


;; Public functions
(define-public (name)
  (ok "Hodl")
)

;; Transfers tokens to a specified principal.
(define-public (transfer (recipient principal) (amount uint))
   (match (ft-transfer? spendable-token amount tx-sender recipient)
    result (ok true)
    error (err false))
)

(define-public (hodl (amount uint))
  (begin
    (unwrap-panic (ft-transfer? spendable-token amount tx-sender (as-contract tx-sender)))
    (let ((original-sender tx-sender))
     (ok (unwrap-panic (as-contract (ft-transfer? hodl-token amount tx-sender original-sender))))
    )
  )
)

(define-public (unhodl (amount uint))
  (begin
    (print (ft-transfer? hodl-token amount tx-sender (as-contract tx-sender)))
    (let ((original-sender tx-sender))
      (print (as-contract (ft-transfer? spendable-token amount tx-sender original-sender)))
    )
  )
)

(define-read-only (balance-of (owner principal))
   (+ (ft-get-balance spendable-token owner) (ft-get-balance hodl-token owner))
)

(define-read-only (hodl-balance-of (owner principal))
  (ft-get-balance hodl-token owner)
)

(define-read-only (spendable-balance-of (owner principal))
  (ft-get-balance spendable-token owner)
)

(define-read-only (get-spendable-in-bank)
  (ft-get-balance spendable-token (as-contract tx-sender))
)

(define-read-only (get-hodl-in-bank)
  (ft-get-balance hodl-token (as-contract tx-sender))
)

;; Mint new tokens.
(define-private (mint (account principal) (amount uint))
    (begin
      (unwrap-panic (ft-mint? spendable-token amount account))
      (unwrap-panic (ft-mint? hodl-token amount (as-contract tx-sender)))
      (ok amount)))

(define-public (buy-tokens (amount uint))
  (begin
    (unwrap-panic (stx-transfer? amount tx-sender 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV))
    (mint tx-sender amount)
  )
)

;; Initialize the contract
(begin
  (mint 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV u990000)
)
