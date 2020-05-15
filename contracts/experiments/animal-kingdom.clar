(define-non-fungible-token animal-kingdom-token uint)

;; Storage
(define-map rulers
  ((token-id uint))
  ((domain (buff 255))
   (ruler (buff 255))
  )
)

(define-data-var current-id uint u0)
(define-data-var token-ids (list 10 uint) (list))

;; Internals

;; Gets the owner of the specified token ID.
(define-private (owner-of? (token-id uint))
  (nft-get-owner? animal-kingdom-token token-id)
)

(define-private (is-owner (ruler principal) (token-id uint))
  (is-eq ruler
       ;; if no owner, return false
       (unwrap! (owner-of? token-id) false)
  )
)

(define-read-only (get-info)
  (ok { current-id: (var-get current-id) })
)

(define-read-only (get-tokens)
  (ok (map owner-of? (var-get token-ids)))
)

;; Mint new tokens.
(define-public (mint-next (ruler principal))
    (if (is-eq tx-sender 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)
        (let ((next-id (+ (var-get current-id) u1)))
        (begin (print (as-max-len? (append (var-get token-ids) next-id) u10))
           (let ((new-list (unwrap! (as-max-len? (append (var-get token-ids) next-id) u10) (err u100))))
              (begin
                (var-set current-id next-id)
                (var-set token-ids new-list)
                (match (nft-mint? animal-kingdom-token next-id ruler)
                  success (ok next-id)
                  error (err u2)
                )
              )
           )
        )
      )
      (err u1)
    )
)

;; Initialize the contract
