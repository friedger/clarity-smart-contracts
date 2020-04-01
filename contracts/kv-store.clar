(define-map store ((key principal))
  ((rocket-id int) (ordered-at-block int) (ready-at-block int) (balance int) (size int)))

(define-public (get-value (key principal))
    (match (map-get? store ((key key)))
        entry (ok (get v2 entry))
        (err 0)))

(define-public (set-value (key principal))
    (begin
        (map-set store ((key tx-sender)) ((rocket-id 100) (ordered-at-block 7) (ready-at-block 8) (balance 9) (size 4)))
        (ok 'true)))
