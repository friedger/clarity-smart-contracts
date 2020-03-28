(define-map licenser-address
  ((id int))
  ((address principal)))

(define-map licenses
  ((licensee principal))
  ((type int) (block int)))

(define-map price-list
  ((type int))
  ((price int)))


(define-constant licenser-already-set-err (err 1))
(define-constant invalid-license-type-err (err 2))
(define-constant missing-licenser-err (err 3))
(define-constant payment-err (err 4))
(define-constant license-exists-err (err 5))

(define-private (get-licenser)
  (map-get? licenser-address ((id 0)))
)

(define-private (get-price (type int))
  (get price (map-get? price-list ((type type))))
)

(define-private (get-license (licensee principal))
 (map-get? licenses ((licensee licensee)))
)


(define-private (has-valid-license (licensee principal) (block-height int))
  (let ((license-type (default-to 0 (get type (map-get? licenses ((licensee licensee))))))
    (license-block (default-to 0 (get block (map-get? licenses ((licensee licensee)))))))
    (if (not (is-eq license-type 0))
      (if (is-eq  license-type 1)
        'true
        (if (is-eq license-type 2)
          (< block-height license-block)
          'false
         )
      )
      'false
    )
  )
)

(define-private (should-buy (type int) (duration int) (existing-type int) (existing-block int))
  (if (is-eq existing-type 1)
    'false
    (if (is-eq existing-type 2)
      (if (is-eq type 1)
        'true
        (if (is-eq type 2)
          (< existing-block block-height)
          'true
        )
      )
      'true
    )
  )
)

(define-private (buy (type int) (duration int))
  (let ((existing-license (map-get? licenses ((licensee tx-sender))))
    (price (unwrap! (get-price type) invalid-license-type-err))
    (licenser (unwrap! (get address (get-licenser)) missing-licenser-err)))
    (let ((licensePrice
      (if (is-eq type 1)
        price
        (* price duration))))
      (if (should-buy type duration (default-to 0 (get type existing-license)) (default-to 0 (get block existing-license)))
        (let ((transferred
          (contract-call! token transfer licenser licensePrice )))
          (if (is-ok transferred)
            (begin
              (map-set licenses ((licensee tx-sender)) ((type type) (block (+ duration block-height))))
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
  (map-insert price-list ((type 1)) ((price 100)))
  (map-insert price-list ((type 2)) ((price 1)))
  (map-insert licenser-address ((id 0)) ((address 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)))
)
