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

;; Non Fungible Token, modeled after ERC-721
(define-non-fungible-token non-fungible-token uint)

;; Storage
(define-map tokens-spender
  uint
  principal)
(define-map tokens-count
  principal
  uint)
(define-map accounts-operator
  (tuple (operator principal) (account principal))
  (tuple (is-approved bool)))

;; Internals

;; Gets the amount of tokens owned by the specified address.
(define-private (balance-of (account principal))
  (default-to u0 (map-get? tokens-count account)))

;; Gets the owner of the specified token ID.
(define-public (get-owner (token-id uint))
  (ok (nft-get-owner? non-fungible-token token-id)))

;; Gets the approved address for a token ID, or zero if no address set (approved method in ERC721)
(define-private (is-spender-approved (spender principal) (token-id uint))
  (let ((approved-spender
         (unwrap! (map-get? tokens-spender token-id)
                   false))) ;; return false if no specified spender
    (is-eq spender approved-spender)))

;; Tells whether an operator is approved by a given owner (isApprovedForAll method in ERC721)
(define-private (is-operator-approved (account principal) (operator principal))
  (default-to false
    (get is-approved
         (map-get? accounts-operator {operator: operator, account: account}))))

(define-private (is-owner (actor principal) (token-id uint))
  (is-eq actor
       ;; if no owner, return false
       (unwrap! (nft-get-owner? non-fungible-token token-id) false)))

;; Returns whether the given actor can transfer a given token ID.
;; To be optimized
(define-private (can-transfer (actor principal) (token-id uint))
  (or
   (is-owner actor token-id)
   (is-spender-approved actor token-id)
   (is-operator-approved (unwrap! (nft-get-owner? non-fungible-token token-id) false) actor)))

;; Internal - Register token
(define-private (mint-token (token-id uint) (new-owner principal))
  (let ((current-balance (balance-of new-owner)))
      (match (nft-mint? non-fungible-token token-id new-owner)
        success
          (begin
            (map-set tokens-count
              new-owner
              (+ u1 current-balance))
            true)
        error false)))

;; Internal - Release token
(define-private (transfer-token (token-id uint) (owner principal) (new-owner principal))
  (let
    ((current-balance-owner (balance-of owner))
      (current-balance-new-owner (balance-of new-owner)))
    (begin
      (map-delete tokens-spender
        token-id)
      (map-set tokens-count
        owner
        (- current-balance-owner u1))
      (map-set tokens-count
        new-owner
        (+ current-balance-new-owner u1))
      true)))

;; Public functions

(define-constant same-spender-err (err u1))
(define-constant not-approved-spender-err (err u2))
(define-constant failed-to-move-token-err (err u3))
(define-constant unauthorized-transfer-err (err u4))
(define-constant failed-to-mint-err (err u5))

;; Approves another address to transfer the given token ID (approve method in ERC721)
;; To be optimized
(define-public (set-spender-approval (spender principal) (token-id uint))
  (if (is-eq spender tx-sender)
      same-spender-err
      (if (or (is-owner tx-sender token-id)
              (is-operator-approved
               (unwrap! (nft-get-owner? non-fungible-token token-id) not-approved-spender-err)
               tx-sender))
          (begin
            (map-set tokens-spender
                        token-id
                        spender)
            (ok token-id))
          not-approved-spender-err)))

;; Sets or unsets the approval of a given operator (setApprovalForAll method in ERC721)
(define-public (set-operator-approval (operator principal) (is-approved bool))
  (if (is-eq operator tx-sender)
      same-spender-err
      (begin
        (map-set accounts-operator
                    {operator: operator, account: tx-sender}
                    {is-approved: is-approved})
        (ok true))))

;; Transfers the ownership of a given token ID to another address.
(define-public (transfer-from (token-id uint) (owner principal) (recipient principal))
  (if (and
        (can-transfer tx-sender token-id)
        (is-owner owner token-id)
        (not (is-eq recipient owner)))
       (match (nft-transfer? non-fungible-token token-id owner recipient)
        success (ok token-id)
        error (err failed-to-move-token-err))
      (err unauthorized-transfer-err)))

;; Transfers tokens to a specified principal.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (transfer-from token-id tx-sender recipient))

;; Mint new tokens.
(define-private (mint (owner principal) (token-id uint))
  (if (mint-token token-id owner)
      (ok token-id)
      (err failed-to-mint-err)))

;; Initialize the contract
(begin
  (try! (mint 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M u1))
  (try! (mint 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M u2))
  (try! (mint 'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9 u3)))
