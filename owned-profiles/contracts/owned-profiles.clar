;; @contract Ownable Profiles
;; @version 1
;;

(define-trait ownable-trait (
  (get-owner (uint) (response (optional principal) uint))
))

(define-map user-profile principal {contract: principal, id: uint})
(define-map profile-user {contract: principal, id: uint} principal)

(define-constant err-not-authorized (err u403))
(define-constant err-not-found (err u404))

;; @desc register a ownable profile item. Returns `(ok true)` on success
;; @param ownable; an NFT or similar that is ownable
;; @param id; identifier of the ownable
(define-public (register (ownable <ownable-trait>) (id uint))
    (match (contract-call? ownable get-owner id)
        optional-owner
            (match optional-owner
                owner (let ((current-profile (map-get? user-profile tx-sender))
                            (new-profile {contract: (contract-of ownable), id: id}))
                        (asserts! (is-eq owner tx-sender) err-not-authorized)
                        (match current-profile
                            profile (map-delete profile-user profile)
                            true)
                        (map-set user-profile tx-sender new-profile)
                        (map-set profile-user new-profile tx-sender)
                        (ok true))
                err-not-found )
        error err-not-found))

;; @desc remove registration entry of tx-sender's ownable profile. Returns `(ok true)` on success
(define-public (delete)
  (let ((current-profile (unwrap! (map-get? user-profile tx-sender) (ok true))))
      (map-delete user-profile tx-sender)
      (map-delete profile-user current-profile)
      (ok true)))

;;
;; read-only functions
;;

;; @desc returns the registered profile. The registration does not verify
;; whether the user indeed owns the profile item.
(define-read-only (get-unverified-profile (user principal))
    (map-get? user-profile user))

;; @desc returns the registered profile if it is part of the provided contract.
;; the profile item is owned by the user at the time of calling.
(define-public (resolve-principal-to-profile (user principal) (ownable <ownable-trait>))
    (let ((registered-profile (unwrap! (map-get? user-profile user) (ok none)))
        (owner (unwrap! (unwrap! (contract-call? ownable get-owner (get id registered-profile)) (ok none)) (ok none))))
        (asserts! (is-eq (contract-of ownable) (get contract registered-profile)) (ok none))
        (if (is-eq owner user)
                (ok (some registered-profile))
                (ok none))))

;; @desc returns the owner of the provided profile item if the owner registered the item as user profile.
(define-public (resolve-profile-to-principal (ownable <ownable-trait>) (id uint))
    (let ((registered-owner (unwrap! (map-get? profile-user {contract: (contract-of ownable), id: id}) (ok none)))
            (owner (unwrap! (unwrap! (contract-call? ownable get-owner id) err-not-found) err-not-found)))
        (if (is-eq owner registered-owner)
            (ok (some owner))
            (ok none))))
