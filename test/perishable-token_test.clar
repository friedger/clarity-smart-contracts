;; test that token is not perished after mint
;; token can't be minted while time-to-perish is smaller than burn block height
;; @mine-blocks-before 10
(define-public (test-perish)
    (let
        ((token-id (contract-call? .perishable-token mint)))
        (asserts! (is-eq burn-block-height u10) (err (concat "invalid burn block height " (int-to-ascii burn-block-height))))
        (asserts! (is-eq token-id (ok u1)) (err "expected (ok u1) token-id"))
        (asserts! (not (unwrap! (contract-call? .perishable-token perished u1) (err "id not found"))) (err "expected not yet perished"))
        (ok true)
    ))