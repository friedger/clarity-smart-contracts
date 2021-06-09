;; historical stacks balance of user
(define-read-only (get-balance (user principal) (bh uint))
  (ok (at-block (unwrap! (get-block-info? id-header-hash bh) (err u9999)) (stx-get-balance user)))
)


