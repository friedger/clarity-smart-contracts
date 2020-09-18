(define-non-fungible-token kingdom-token uint)

;; Storage
(define-map rulers
  ((kingdom-id uint))
  ((domain (buff 255))
   (ruler principal)))

(define-map lookup ((domain (buff 255))) ((kingdom-id uint)))

(define-data-var last-kingdom-id uint u0)

(define-private (is-owner (ruler principal) (kingdom-id uint))
  (is-eq ruler
       ;; if no owner, return false
       (unwrap! (owner-of? kingdom-id) false)))

(define-data-var panic-trigger (optional bool) none)

(define-private (assert-panic (value bool))
   (if value
    true
    (unwrap-panic (var-get panic-trigger))
  )
)

;; Mint new tokens.
(define-public (register (domain (buff 255)))
    (let ((kingdom-id (+ (var-get last-kingdom-id) u1)))
      (begin
          (var-set last-kingdom-id kingdom-id)
          (match (nft-mint? kingdom-token kingdom-id tx-sender)
            success (begin
                (assert-panic (map-insert rulers {kingdom-id: kingdom-id} {domain: domain, ruler: tx-sender}))
                (assert-panic (map-insert lookup {domain: domain} {kingdom-id: kingdom-id}))
                (ok kingdom-id)
              )
            error (err u2)))))

(define-read-only (get-info)
  (ok { last-kingdom-id: (var-get last-kingdom-id)}))


;; Gets the owner of the specified token ID.
(define-read-only (owner-of? (kingdom-id uint))
  (nft-get-owner? kingdom-token kingdom-id))


(define-read-only (owner-of-domain? (domain (buff 255)))
  (owner-of? (unwrap-panic (get kingdom-id (map-get? lookup {domain: domain})))))
