(define-map store (tuple (key principal))
  (tuple (v1 int)
   (v2 int))
)

(define-public (get-value (key principal))
    (match (map-get? store {key: key})
        entry (ok (get v2 entry))
        (err 0)))

(define-public (set-value (key principal))
    (begin
        (map-set store {key: tx-sender} {v1: 100, v2: 7})
        (ok true)))
