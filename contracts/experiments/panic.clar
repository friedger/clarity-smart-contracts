
(define-data-var trigger (optional uint) none)

(define-private (panic-private)
  (unwrap-panic (var-get trigger))
)

(define-read-only (panic-read-only)
  (ok (panic-private))
)

(define-public (panic)
  (ok (panic-private))
)
