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
(define-constant funds-address 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)

;;; Storage
(define-map rockets-count
  ((owner principal))
  ((count uint)))
(define-map factory-address
  ((id int))
  ((address principal)))

;;; Constants

(define-constant no-such-rocket-err      (err u10))
(define-constant bad-rocket-transfer-err (err u20))
(define-constant unauthorized-mint-err   (err u30))
(define-constant factory-already-set-err (err u40))
(define-constant factory-not-set-err (err u50))

;;; Internals

;; Gets the amount of rockets owned by the specified address
;; args:
;; @account (principal) the principal of the user
;; returns: uint
(define-public (get-balance (account principal))
  (ok
    (default-to u0
      (get count
        (map-get? rockets-count ((owner account)))
      )
    )
  )
)

;; Check if the transaction has been sent by the factory-address
;; returns: boolean
(define-private (is-tx-from-factory)
  (let ((address
         (get address
              (unwrap! (map-get? factory-address ((id 0)))
                        false))))
    (is-eq tx-sender address)))

;; Gets the owner of the specified rocket ID
;; args:
;; @rocket-id (int) the id of the rocket to identify
;; returns: option<principal>
(define-private (owner-of (rocket-id uint))
  (nft-get-owner? rocket rocket-id)
)

;;; Public functions

;; Transfers rocket to a specified principal
;; Once owned, users can trade their rockets on any unregulated black market
;; args:
;; @recipient (principal) the principal of the new owner of the rocket
;; @rocket-id (int) the id of the rocket to trade
;; returns: Response<int,int>
;; (define-public (transfer-rocket (recipient principal) (rocket-id uint))
;;   (let ((balance-sender (get-balance tx-sender))
;;         (balance-recipient (get-balancerecipient)))
;;     (if (and
;;          (is-eq (unwrap! (owner-of rocket-id) no-such-rocket-err)
;;               tx-sender)
;;          (> balance-sender 0)
;;          (not (is-eq recipient tx-sender)))
;;         (begin
;;           (nft-transfer? rocket rocket-id tx-sender recipient)
;;           (map-set rockets-count
;;                       ((owner recipient))
;;                       ((count (+ balance-recipient 1))))
;;           (map-set rockets-count
;;                       ((owner tx-sender))
;;                       ((count (- balance-sender 1))))
;;           (ok rocket-id))
;;         bad-rocket-transfer-err))
;; )

;; Mint new rockets
;; This function can only be called by the factory.
;; args:
;; @owner (principal) the principal of the owner of the new rocket
;; @rocket-id (int) the id of the rocket to mint
;; @size (int) the size of the rocket to mint
;; returns: Response<int, int>
(define-public (mint (owner principal) (rocket-id uint) (size uint))
  (if (is-tx-from-factory)
      (let ((current-balance (unwrap! (get-balance owner) (err u0))))
        (begin
          (print u128)
          (print current-balance)
          (print size)
          (print owner)
          (map-set rockets-count
                      ((owner owner))
                      ((count (+ u1 current-balance))))
          (ok true)
        )
      )
      unauthorized-mint-err))

;; Set Factory
;; This function can only be called once.
;; args:
;; returns: Response<Principal, int>
(define-public (set-factory)
  (let ((factory-entry
         (map-get? factory-address ((id 0)))))
    (if (and (is-none factory-entry)
             (map-insert factory-address
                            ((id 0))
                            ((address tx-sender))))
        (ok tx-sender)
        factory-already-set-err)))
