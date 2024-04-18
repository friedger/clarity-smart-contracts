(use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-public (transfer-two (ft-contract {token: <ft-trait>}) (nft-contract {token: <nft-trait>}) (amount uint) (recipient principal))
    (let ((ft (get token ft-contract))
          (nft (get token nft-contract)))
        (try! (contract-call? ft transfer amount tx-sender recipient none))
        (try! (contract-call? nft transfer amount tx-sender recipient))
        (ok true)))

(define-public (transfer-many (fts (list 10 {token: <ft-trait>, amount: uint, recipient: principal})))
        (ok (map transfer-many-iter fts)))

(define-private (transfer-many-iter (transfer {token: <ft-trait>, amount: uint, recipient: principal}))
    (let ((ft (get token transfer)))
        (contract-call? ft transfer (get amount transfer) tx-sender (get recipient transfer) none)))

(define-read-only (to-ft-trait (ft <ft-trait>))
    ft)