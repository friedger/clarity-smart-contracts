;; routes the call with the correct tokens
(define-public (transfer-two (amount uint) (recipient principal))
    (contract-call? .trait-conversion transfer-two
        {token: .fungible-token }
        {token: .beeple}
        amount recipient))

(define-constant default-list (list {token: .fungible-token, amount: u1, recipient: (as-contract tx-sender)}))

(define-public (transfer-many-default)
    (if true (contract-call? .trait-conversion transfer-many default-list) (err u1)))