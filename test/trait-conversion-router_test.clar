(define-public (test-router)
    (let (
            (result-1 (contract-call? .trait-conversion-router transfer-two u1 (as-contract tx-sender)))
            (result-2 (contract-call? .trait-conversion-router transfer-many-default))
        )
        (asserts! (is-eq result-1 (err u1)) (err "transfer-two did not fail"))
        (asserts! (is-eq result-2 (ok (list (err u1)))) (err "transfer-many-default did not fail"))
        (ok true)))