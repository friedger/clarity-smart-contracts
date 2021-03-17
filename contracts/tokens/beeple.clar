(impl-trait 'ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0.nft-trait.nft-trait)
(define-non-fungible-token beeple uint)

;; Public functions
(define-constant unauthorized-transfer-err (err {kind: "permission-denied", code: u3}))
(define-constant not-found-err (err {kind: "nft-not-found", code: u4}))

;; Transfers tokens to a specified principal.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq tx-sender (unwrap! (nft-get-owner? beeple token-id) not-found-err))
        (is-eq tx-sender sender)
        (not (is-eq recipient sender)))
       (match (nft-transfer? beeple token-id sender recipient)
        success (ok success)
        error (err {kind: "nft-transfer-failed", code: error}))
      unauthorized-transfer-err))

;; Gets the owner of the specified token ID.
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? beeple token-id)))

;; Gets the owner of the specified token ID.
(define-read-only (get-last-token-id)
  (ok u1))

(define-read-only (get-token-uri (token-id uint))
  (ok (some "ipfs://ipfs/QmPAg1mjxcEQPPtqsLoEcauVedaeMH81WXDPvPx3VC5zUz")))

(define-read-only (get-meta (token-id uint))
  (if (is-eq token-id u1)
    (ok (some {name: "EVERYDAYS: THE FIRST 5000 DAYS", uri: "https://ipfsgateway.makersplace.com/ipfs/QmZ15eQX8FPjfrtdX3QYbrhZxJpbLpvDpsgb2p3VEH8Bqq", mime-type: "image/jpeg"}))
    (ok none)))

(define-read-only (get-nft-meta)
  (ok (some {name: "beeple", uri: "https://ipfsgateway.makersplace.com/ipfs/QmZ15eQX8FPjfrtdX3QYbrhZxJpbLpvDpsgb2p3VEH8Bqq", mime-type: "image/jpeg"})))

;; Initialize the contract
(try! (nft-mint? beeple u1 tx-sender))
