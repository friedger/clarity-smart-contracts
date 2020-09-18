(define-non-fungible-token todo-nft uint)

(define-map registry
  ((todo-id uint))
  (
    (name (buff 30))
    (url (buff 255))
  )
)

(define-map lookup
  ((name (buff 30)))
  ((todo-id uint))
)

(define-data-var last-todo-id uint u0)

(define-data-var panic-trigger (optional bool) none)
(define-private (assert-panic (value bool))
  (if value true (unwrap-panic (var-get panic-trigger)))
)

(define-public (register (name (buff 30)) (url (buff 255)))
  (let ((todo-id (+ u1 (var-get last-todo-id))))
    (var-set last-todo-id todo-id)
    (unwrap-panic (nft-mint? todo-nft todo-id tx-sender))
    (assert-panic (map-insert registry {todo-id: todo-id} {name: name, url: url}))
    (assert-panic (map-insert lookup {name: name} {todo-id: todo-id}))
    (ok todo-id)
  )
)

(define-public (update (todo-id uint) (name (buff 30)) (url (buff 200)))
  (let ((owner (unwrap-panic (nft-get-owner? todo-nft todo-id))))
    (if (is-eq owner tx-sender)
      (begin
        (assert-panic (map-set registry {todo-id: todo-id} {name: name, url: url}))
        (assert-panic (map-set lookup {name: name} {todo-id: todo-id}))
        (ok true)
      )
      (err u1)
    )
  )
)

(define-private (token-id-for (name (buff 30)))
  (unwrap-panic (get todo-id (map-get? lookup {name: name})))
)

(define-read-only (owner-of (name (buff 30)))
  (nft-get-owner? todo-nft (token-id-for name))
)

(define-read-only (get-last-todo-id)
  (var-get last-todo-id)
)
