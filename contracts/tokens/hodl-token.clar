;; Simple Token that users can hodl

(define-fungible-token spendable-token)
(define-fungible-token hodl-token)
(define-constant bank-account 'ST000000000000000000002AMW42H)


;; Public functions

;; Transfers tokens to a specified principal.
(define-public (transfer (recipient principal) (amount uint))
   (match (ft-transfer? spendable-token amount tx-sender recipient)
    result (ok 'true)
    error (err 'false))
)

(define-public (hodl (amount uint))
  (begin
    (ft-transfer? spendable-token amount tx-sender bank-account)
    (ft-transfer? hodl-token amount bank-account tx-sender)
  )
)

(define-public (unhodl (amount uint))
  (begin
    (ft-transfer? hodl-token amount tx-sender bank-account)
    (ft-transfer? spendable-token amount bank-account tx-sender)
  )
)

(define-public (balance-of (owner principal))
  (ok (+ (ft-get-balance spendable-token owner) (ft-get-balance hodl-token owner)))
)

(define-public (hodl-balance-of (owner principal))
  (ok (ft-get-balance hodl-token owner))
)

;; Mint new tokens.
(define-private (mint (account principal) (amount uint))
    (begin
      (ft-mint? spendable-token amount account)
      (ft-mint? hodl-token amount bank-account)
      (ok amount)))

;; Initialize the contract
(begin
  (mint 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M u20)
  (mint 'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9 u10))
