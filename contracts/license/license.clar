(define-map licenser-address
  ((id int))
  ((address principal)))

(define-map licensees
  ((licensee principal))
  ((type int) (block int)))

(define-map price-list
  ((type int))
  ((price int)))


(define licenser-already-set-err (err 1))
(define invalid-license-type-err (err 2))
(define missing-licenser-err (err 3))
(define payment-err (err 4))


(define (get-licenser)
  (fetch-entry licenser-address ((id 0)))
)

(define (get-price (type int))
  (get price (fetch-entry price-list ((type type))))
)

(define (get-license (licensee principal))
 (fetch-entry licensees ((licensee licensee)))
)

(define (get-block-height )
  block-height
)

(define (has-valid-license (licensee principal) (block-height int))
  (let ((license-type (default-to 0 (get type (fetch-entry licensees ((licensee licensee))))))
  (license-block (default-to 0 (get block (fetch-entry licensees ((licensee licensee)))))))
    (if (not (eq? license-type 0))
      (if (eq?  license-type 1)
        'true
        (if (eq? license-type 2)
          (< block-height (+ license-block  1))
          'false
        ))
      'false
  ))
)

(define-public (buy (type int))
  (let ((price (expects! (get-price type) invalid-license-type-err))
    (licenser (expects! (get address (get-licenser)) missing-licenser-err)))
      (let ((transferred
        (contract-call! token transfer licenser price )))
        (if (is-ok? transferred)
          (begin
            (insert-entry! licensees ((licensee tx-sender)) ((type type) (block block-height)))
            (ok price))
          payment-err))
  )
)


(begin
  (insert-entry! price-list ((type 1)) ((price 100)))
  (insert-entry! price-list ((type 2)) ((price 1)))
  (insert-entry! licenser-address ((id 0)) ((address 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)))
)
