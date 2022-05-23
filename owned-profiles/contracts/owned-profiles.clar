;; @contract Ownable Profiles
;; @version 1
;;

(define-trait ownable-trait (
  (get-owner (uint) (response (optional principal) uint))
))

(define-trait commission-trait
  ((pay (<ownable-trait> uint) (response bool uint))))


(define-map user-profile principal {contract: principal, id: uint})
(define-map profile-user {contract: principal, id: uint} principal)
(define-map profile-blocked-period {contract: principal, id: uint} uint)

;; about 1 month
(define-constant blocking-period u4000)

(define-constant err-payment-required (err 402))
(define-constant err-not-authorized (err u403))
(define-constant err-not-found (err u404))
(define-constant err-profile-blocked (err u500))
(define-constant err-invalid-profile (err u501))

;; @desc register a ownable profile item. Returns `(ok true)` on success
;; @param ownable; an NFT or similar that is ownable
;; @param id; identifier of the ownable
;; @param commission-trait; fee to be paid during registration
(define-public (register (ownable <ownable-trait>) (id uint) (commission <commission-trait>))
    (let ((owner (unwrap! (unwrap! (contract-call? ownable get-owner id) err-not-found) err-not-found))
          (current-profile (map-get? user-profile tx-sender))
          (new-profile {contract: (contract-of ownable), id: id}))
        (asserts! (is-eq owner tx-sender) err-not-authorized)
        (asserts! (is-profile-ready new-profile) err-profile-blocked)
        (match current-profile
          profile (begin
            (delete-profile profile)
            (block-profile profile))
          true)
        (map-set user-profile tx-sender new-profile)
        (map-set profile-user new-profile tx-sender)
        (contract-call? commission pay ownable id)))

;; @desc remove profile entry of tx-sender's ownable profile.
;; Returns `(ok true)` on success
(define-public (delete)
  (let ((profile (unwrap! (map-get? user-profile tx-sender) (ok true))))
      (map-delete user-profile tx-sender)
      (delete-profile profile)
      (ok true)))

;; @desc remove profile entry of tx-sender's ownable profile.
;; @param ownable; must be the contract used during registration
;; The profile must be owned by sender. The profile is blocked for 4000 blocks.
;; Returns `(ok true)` on success
(define-public (delete-and-block (ownable <ownable-trait>))
  (let ((profile (unwrap! (map-get? user-profile tx-sender) (ok true)))
      (owner (unwrap! (unwrap! (contract-call? ownable get-owner (get id profile)) err-not-found) err-not-found)))
      (asserts! (is-eq owner tx-sender) err-not-authorized)
      (asserts! (is-eq (contract-of ownable) (get contract profile)) err-invalid-profile)
      (map-delete user-profile tx-sender)
      (delete-profile profile)
      (block-profile profile)
      (ok true)))

;;
;; read-only functions
;;

;; @desc returns the registered profile. The registration does not verify
;; whether the user indeed owns the profile item.
;; @param user; the user with a profile
(define-read-only (get-unverified-profile (user principal))
    (map-get? user-profile user))

;; @desc returns the registered profile if it is part of the provided contract.
;; the profile item is owned by the user at the time of calling.
;; @param user; the user with a profile
;; @param ownable; the contract of the profile
(define-public (resolve-principal-to-profile (user principal) (ownable <ownable-trait>))
    (let ((profile (unwrap! (map-get? user-profile user) (ok none)))
        (owner (unwrap! (unwrap! (contract-call? ownable get-owner (get id profile)) (ok none)) (ok none))))
        (asserts! (is-eq (contract-of ownable) (get contract profile)) (ok none))
        (if (is-eq owner user)
            (ok (some profile))
            (ok none))))

;; @desc returns the owner of the provided profile item if the owner registered the item as user profile.
;; @param ownable; the contract of the profile
;; @param id; the id of the profile
(define-public (resolve-profile-to-principal (ownable <ownable-trait>) (id uint))
    (let ((registered-owner (unwrap! (map-get? profile-user {contract: (contract-of ownable), id: id}) (ok none)))
            (owner (unwrap! (unwrap! (contract-call? ownable get-owner id) err-not-found) err-not-found)))
        (if (is-eq owner registered-owner)
            (ok (some owner))
            (ok none))))

;; @desc returns true if the profile is not blocked for new registrations
;; @param profile; tuple of contract and id of the profile
(define-read-only (is-profile-ready (profile {contract: principal, id: uint}))
  (> block-height (unwrap! (map-get? profile-blocked-period profile) true)))

;; @desc returns the block height until the profile can't be used by other users
;; @param ownable; the contract of the profile
;; @param id; the id of the profile
(define-read-only (get-profile-blocked-until (ownable <ownable-trait>) (id uint))
  (map-get? profile-blocked-period {contract: (contract-of ownable), id: id}))

;; private function
(define-private (delete-profile (profile {contract: principal, id: uint}))
  (map-delete profile-user profile))

(define-private (block-profile (profile {contract: principal, id: uint}))
  (map-set profile-blocked-period profile (+ block-height blocking-period)))
