(define-data-var last-item uint u0)

(define-public (append-item (user-list (list 10 uint)) (item uint))
   (begin
    (var-set last-item item)
    (ok (append user-list item))
   )
)

(define-data-var foo (list 10 int) (list 1 1 1 1 1 1 1 1 1))

(define-public (bar)
   (begin
   (print "hello")
    (ok (var-set foo (unwrap-panic (as-max-len? (concat (var-get foo);; 1
    (print (list 1))
    ) u10))))
   )
)
