(use-trait ownable-trait .owned-profiles.ownable-trait)
(define-constant deployer tx-sender)

(define-public (pay (ownable <ownable-trait>) (id uint))
  (stx-transfer? u2000000 tx-sender deployer))
