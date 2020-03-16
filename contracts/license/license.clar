(define-map licenser-address
  ((id int))
  ((address principal)))

(define-map licenses
  ((licensee principal))
  ((type int) (block int)))

(define-map price-list
  ((type int))
  ((price int)))


(define licenser-already-set-err (err 1))
(define invalid-license-type-err (err 2))
(define missing-licenser-err (err 3))
(define payment-err (err 4))
(define license-exists-err (err 5))

(define (get-licenser)
  (fetch-entry licenser-address ((id 0)))
)

(define (get-price (type int))
  (get price (fetch-entry price-list ((type type))))
)

(define (get-license (licensee principal))
 (fetch-entry licenses ((licensee licensee)))
)

(define (get-block-height )
  block-height
)

(define (has-valid-license (licensee principal) (block-height int))
  (let ((license-type (default-to 0 (get type (fetch-entry licenses ((licensee licensee))))))
    (license-block (default-to 0 (get block (fetch-entry licenses ((licensee licensee)))))))
    (if (not (eq? license-type 0))
      (if (eq?  license-type 1)
        'true
        (if (eq? license-type 2)
          (< block-height license-block)
          'false
         )
      )
      'false
    )
  )
)

(define (should-buy? (type int) (duration int) (existing-type int) (existing-block int))
  (if (eq? existing-type 1)
    'false
    (if (eq? existing-type 2)
      (if (eq? type 1)
        'true
        (if (eq? type 2)
          (< existing-block (get-block-height))
          'true
        )
      )
      'true
    )
  )
)

(define (buy (type int) (duration int))
  (let ((existing-license (fetch-entry licenses ((licensee tx-sender))))
    (price (expects! (get-price type) invalid-license-type-err))
    (licenser (expects! (get address (get-licenser)) missing-licenser-err)))
    (let ((licensePrice
      (if (eq? type 1)
        price
        (* price duration))))
      (if (should-buy? type duration (default-to 0 (get type existing-license)) (default-to 0 (get block existing-license)))
        (let ((transferred
          (contract-call! token transfer licenser licensePrice )))
          (if (is-ok? transferred)
            (begin
              (set-entry! licenses ((licensee tx-sender)) ((type type) (block (+ duration block-height))))
              (ok licensePrice))
            payment-err)
        )
        license-exists-err)
    )
  )
)

(define-public (buy-non-expiring)
  (buy 1 0 )
)

(define-public (buy-expiring (duration int))
  (buy 2 duration)
)

(begin
  (insert-entry! price-list ((type 1)) ((price 100)))
  (insert-entry! price-list ((type 2)) ((price 1)))
  (insert-entry! licenser-address ((id 0)) ((address 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)))
)
