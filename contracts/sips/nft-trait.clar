(define-trait stacks-token-nft-standard-v1
  (
    ;; Token ID, limited to uint range
    (last-token-id () (response uint uint))

    ;; Owner of given token identifier
    (get-owner? (uint) (response (optional principal) uint))

    ;; Transfer from to
    (transfer? (uint principal principal) (response bool (tuple (kind (string-ascii 32)) (code uint))))
  )
)
