(impl-trait 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.nft-trait.nft-trait)

;;  copyright: (c) 2013-2019 by Blockstack PBC, a public benefit corporation.

;;  This file is part of Blockstack.

;;  Blockstack is free software. You may redistribute or modify
;;  it under the terms of the GNU General Public License as published by
;;  the Free Software Foundation, either version 3 of the License or
;;  (at your option) any later version.

;;  Blockstack is distributed in the hope that it will be useful,
;;  but WITHOUT ANY WARRANTY, including without the implied warranty of
;;  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
;;  GNU General Public License for more details.

;;  You should have received a copy of the GNU General Public License
;;  along with Blockstack. If not, see <http://www.gnu.org/licenses/>.

;;;; Rocket-Market

(define-non-fungible-token rocket uint)
(define-constant funds-address 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW)

;;; Storage
(define-data-var last-rocket-id uint u0)

(define-map rockets-count
  principal uint)
(define-map factory-address
  int principal)
(define-map rockets-details
  uint {created-at: uint, size: uint})

;;; Constants

(define-constant no-such-rocket-err      (err u10))
(define-constant bad-rocket-transfer-err (err u20))
(define-constant unauthorized-mint-err   (err u30))
(define-constant factory-already-set-err (err u40))
(define-constant factory-not-set-err (err u50))

;;; Internals

;; Determins the maximum of two values
;; retuns: uint
(define-private (max (value1 uint) (value2 uint))
  (if (< value1 value2) value2 value1))

;; Check if the transaction has been sent by the factory-address
;; returns: boolean
(define-private (is-tx-from-factory)
  (let ((address
          (unwrap! (map-get? factory-address 0)
                    false)))
    (is-eq tx-sender address)))

;; Gets the owner of the specified rocket ID
;; args:
;; @rocket-id (int) the id of the rocket to identify
;; returns: option<principal>
(define-read-only (get-owner (rocket-id uint))
  (ok (nft-get-owner? rocket rocket-id))
)

;;; Public functions

;; Transfers rocket to a specified principal
;; Once owned, users can trade their rockets on any unregulated black market
;; args:
;; @recipient (principal) the principal of the new owner of the rocket
;; @rocket-id (int) the id of the rocket to trade
;; returns: Response<int,int>
(define-public (transfer (rocket-id uint) (sender principal) (recipient principal))
   (let ((balance-sender (get-balance tx-sender))
         (balance-recipient (get-balance recipient)))
     (if (and
          (is-eq (unwrap! (nft-get-owner? rocket rocket-id) no-such-rocket-err)
               tx-sender)
          (> balance-sender u0)
          (is-eq tx-sender sender)
          (not (is-eq recipient tx-sender)))
         (begin
           (unwrap! (nft-transfer? rocket rocket-id tx-sender recipient) bad-rocket-transfer-err)
           (map-set rockets-count
                       recipient
                       (+ balance-recipient u1))
           (map-set rockets-count
                       tx-sender
                       (- balance-sender u1))
           (ok true))
         bad-rocket-transfer-err))
)

;; Mint new rockets
;; This function can only be called by the factory.
;; args:
;; @owner (principal) the principal of the owner of the new rocket
;; @rocket-id (int) the id of the rocket to mint
;; @size (int) the size of the rocket to mint
;; returns: Response<int, int>
(define-public (mint (owner principal) (rocket-id uint) (size uint))
  (if (is-tx-from-factory)
      (let ((current-balance (get-balance owner)))
        (begin
          (print u128)
          (print current-balance)
          (print size)
          (print owner)
          (try! (nft-mint? rocket rocket-id owner))
          (map-set rockets-details rocket-id {size: size, created-at: block-height})
          (var-set last-rocket-id (max (var-get last-rocket-id) rocket-id))
          (map-set rockets-count
                      owner
                      (+ u1 current-balance))
          (ok true)
        )
      )
      unauthorized-mint-err))

;;
;; NFT functions
;;

;; Gets the amount of rockets owned by the specified address
;; args:
;; @account (principal) the principal of the user
;; returns: uint
(define-read-only (get-balance (account principal))
  (default-to u0
    (map-get? rockets-count account)
  )
)

;; Last token ID, limited to uint range
(define-read-only (get-last-token-id)
  (ok (var-get last-rocket-id))
)

;; URI for metadata associated with the token
(define-read-only (get-token-uri (rocket-id uint))
  (ok none))

;;
;; Fly functions
;;

;; a map from rocket ships to their allowed
;;  pilots
(define-map allowed-pilots
    uint (list 10 principal))

;; implementing a contains function via fold
(define-private (contains-check
                  (y principal)
                  (to-check { p: principal, result: bool }))
   (if (get result to-check)
        to-check
        { p: (get p to-check),
          result: (is-eq (get p to-check) y) }))

(define-private (contains (x principal) (find-in (list 10 principal)))
   (get result (fold contains-check find-in
    { p: x, result: false })))

(define-read-only (is-my-ship (ship uint))
  (is-eq (some tx-sender) (nft-get-owner? rocket ship)))

;; this function will print a message
;;  (and emit an event) if the tx-sender was
;;  an authorized flyer.
;;
;;  here we use tx-sender, because we want
;;   to allow the user to let other contracts
;;   fly the ship on behalf of users

(define-public (fly-ship (ship uint))
  (let ((pilots (default-to
                   (list)
                  (map-get? allowed-pilots  ship))))
    (if (contains tx-sender pilots)
        (begin (print "Flew the rocket-ship!")
               (ok true))
        (begin (print "Tried to fly without permission!")
               (ok false)))))
;;
;; Authorize a new pilot.
;;
;;  here we want to ensure that this function
;;   was called _directly_ by the user by
;;   checking that tx-sender and contract-caller are equal.
;;  if any other contract is in the call stack, contract-caller
;;   would be updated to a different principal.
;;
(define-public (authorize-pilot (ship uint) (pilot principal))
 (begin
   ;; sender must equal caller: an intermediate contract is
   ;;  not issuing this call.
   (asserts! (is-eq tx-sender contract-caller) (err u1))
   ;; sender must own the rocket ship
   (asserts! (is-eq (some tx-sender)
                  (nft-get-owner? rocket ship)) (err u2))
   (let ((prev-pilots (default-to
                         (list)
                         (map-get? allowed-pilots ship))))
    ;; don't add a pilot already in the list
    (asserts! (not (contains pilot prev-pilots)) (err u3))
    ;; append to the list, and check that it is less than
    ;;  the allowed maximum
    (match (as-max-len? (append prev-pilots pilot) u10)
           next-pilots
             (ok (map-set allowed-pilots ship next-pilots))
           ;; too many pilots already
           (err u4)))))

;;
;; Set Factory
;;
;; This function can only be called once.
;; args:
;; returns: Response<Principal, int>
(define-public (set-factory)
  (let ((factory-entry
         (map-get? factory-address  0)))
    (if (and (is-none factory-entry)
             (map-insert factory-address
                            0 tx-sender))
        (ok tx-sender)
        factory-already-set-err)))
