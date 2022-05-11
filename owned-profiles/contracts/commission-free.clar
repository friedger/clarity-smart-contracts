(use-trait ownable-trait .owned-profiles.ownable-trait)

(define-read-only (pay (ownable <ownable-trait>) (id uint))
  (ok true))
