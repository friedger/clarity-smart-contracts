(define-data-var last-item uint u0)

(define-public (append-item (user-list (list 10 uint)) (item uint))
   (begin
    (var-set last-item item)
    (ok (append user-list item))
   )
)
