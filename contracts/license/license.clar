(define-map licenser-address
  ((id int))
  ((address principal)))

(define-map licensees
  ((licensee principal))
  ((type int)))

(define-map price-list
  ((type int))
  ((price int)))


(define licenser-already-set-err (err 1))
(define invalid-license-type-err (err 2))
(define missing-licenser-err (err 3))


(define (get-licenser)
  (expects! (fetch-entry licenser-address ((id 0)))
    missing-licenser-err
  )
)

(define-public (buy (type int))
  (let ((price (get price (fetch-entry price-list ((type type)))))
    (licenser (get address (get-licenser))))
  (if (and (not (is-none? price)) (not (is-none? licenser)))
    (begin
      (contract-call! token transfer licenser price)
      (insert-entry! licensees ((licensee tx-sender)) ((type type)))
      (ok price))
    invalid-license-type-err))
)



;; Set licenser
;; This function can only be called once.
;; returns: Response<Principal>
(define-public (set-licenser)
  (let ((licenser-entry (get-licenser)))
    (if (and (is-none? licenser-entry)
             (insert-entry! licenser-address
                            ((id 0))
                            ((address tx-sender))))
        (ok tx-sender)
        licenser-already-set-err)))


(begin
  (insert-entry! price-list ((type 1)) ((price 100)))
  (insert-entry! licenser-address ((id 0)) ((address 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)))
)
