;; Simple Token that users can hodl

(define-fungible-token spendable-token)
(define-fungible-token hodl-token)


;; Public functions

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
))

(define-read-only (balance-of (owner principal))
   (+ (ft-get-balance spendable-token owner) (ft-get-balance hodl-token owner))
)

(define-read-only (hodl-balance-of (owner principal))
  (ft-get-balance hodl-token owner)
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
      (ft-mint? spendable-token amount account)
      (ft-mint? hodl-token amount (as-contract tx-sender))
      (ok amount)))

;; Initialize the contract
(begin
  (mint 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M u20)
  (mint 'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9 u10))
