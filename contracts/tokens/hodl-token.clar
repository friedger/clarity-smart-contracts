;; (impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard.ft-trait)
;; Simple Token that users can hodl

(define-fungible-token spendable-token)
(define-fungible-token hodl-token)

;; Public functions
(define-read-only (get-name)
  (ok "Hodl"))

(define-read-only (get-decimals)
  (ok u6))

(define-read-only (get-symbol)
  (ok "HDL"))

(define-read-only (get-token-uri)
  (ok none))

(define-read-only (get-total-supply)
  (ok u0))

;; Transfers tokens to a specified principal.
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (if (is-eq sender tx-sender)
    (match (ft-transfer? spendable-token amount tx-sender recipient)
      result (ok true)
      error (ft-transfer-err error))
  permission-denied-err))

(define-public (hodl (amount uint))
  (begin
    (unwrap-panic (ft-transfer? spendable-token amount tx-sender (as-contract tx-sender)))
    (let ((original-sender tx-sender))
     (ok (unwrap-panic (as-contract (ft-transfer? hodl-token amount tx-sender original-sender)))))))

(define-public (unhodl (amount uint))
  (begin
    (unwrap-panic (ft-transfer? hodl-token amount tx-sender (as-contract tx-sender)))
    (let ((original-sender tx-sender))
      (ok (unwrap-panic (as-contract (ft-transfer? spendable-token amount tx-sender original-sender)))))))

(define-read-only (get-balance (owner principal))
   (ok (+ (ft-get-balance spendable-token owner) (ft-get-balance hodl-token owner))))

(define-read-only (get-hodl-balance (owner principal))
  (ok (ft-get-balance hodl-token owner)))

(define-read-only (get-spendable-balance (owner principal))
  (ok (ft-get-balance spendable-token owner)))

(define-read-only (get-spendable-in-bank)
  (ok (ft-get-balance spendable-token (as-contract tx-sender))))

(define-read-only (get-hodl-in-bank)
  (ok (ft-get-balance hodl-token (as-contract tx-sender))))

;; Mint new tokens.
(define-private (mint (account principal) (amount uint))
    (begin
      (unwrap-panic (ft-mint? spendable-token amount account))
      (unwrap-panic (ft-mint? hodl-token amount (as-contract tx-sender)))
      (ok amount)))

(define-public (buy-tokens (amount uint))
  (begin
    (unwrap-panic (stx-transfer? amount tx-sender 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV))
    (mint tx-sender amount)))

;; error handling
(define-constant permission-denied-err (err u403))
(define-constant not-enough-funds-err (err u404)) ;; not found
(define-constant sender-equals-recipient-err (err u405)) ;; method not allowed
(define-constant invalid-amount-err (err u409)) ;; conflict

(define-map err-strings (response uint uint) (string-ascii 32))
(map-insert err-strings permission-denied-err "permission-denied")
(map-insert err-strings not-enough-funds-err "not-enough-funds")
(map-insert err-strings sender-equals-recipient-err "sender-equals-recipient")
(map-insert err-strings invalid-amount-err "invalid-amount-err")

(define-private (ft-mint-err (code uint))
  (if (is-eq u1 code)
    invalid-amount-err
    (err code)))

(define-private (ft-transfer-err (code uint))
  (if (is-eq u1 code)
    not-enough-funds-err
    (if (is-eq u2 code)
      sender-equals-recipient-err
      (if (is-eq u3 code)
        invalid-amount-err
        (err code)))))

(define-read-only (get-errstr (code uint))
  (unwrap! (map-get? err-strings (err code)) "unknown-error"))

;; Initialize the contract
(begin
  (mint 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV u1000000))
