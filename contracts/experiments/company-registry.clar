(define-non-fungible-token company-nft uint)

(define-map registry
  ((company-id uint))
  (
    (name (buff 30))
    (bns (buff 50))
  )
)

(define-data-var last-company-id uint 0)

(define-public (register (name (buff 30)) (bns (buff 50)))
  (let ((company-id (+ 1 (var-get last-company-id))))
    (var-set last-company-id company-id)
    (map-insert registry {company-id} {name, bns})
  )
)

(define-public (update (company-id uint) (name (buff 30)) (bns (buff 200)))
  (let (owner (unwrap-panic (nft-get-owner? company-nft company-id)))
    (if (is-eq owner tx-sender)
      (ok (map-set registry {company-id} {name, bns}))
      (err u1)
    )
  )
)

