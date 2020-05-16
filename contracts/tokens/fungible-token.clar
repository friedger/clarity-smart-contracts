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

;; Fungible Token, modeled after ERC-20

(define-fungible-token fungible-token)

;; Storage
(define-map allowances
  ((spender principal) (owner principal))
  ((allowance uint)))
(define-data-var total-supply uint u0)

;; Internals

;; Total number of tokens in existence.
(define-private (get-total-supply)
  (var-get total-supply))

;; Gets the amount of tokens that an owner allowed to a spender.
(define-private (allowance-of (spender principal) (owner principal))
  (begin
  (default-to u0
    (get allowance
         (map-get? allowances ((spender spender) (owner owner))))))
)

;; Transfers tokens to a specified principal.
(define-private (transfer (amount uint) (sender principal) (recipient principal) )
  (match (ft-transfer? fungible-token amount sender recipient)
    result (ok true)
    error (err false))
)

;; Decrease allowance of a specified spender.
(define-private (decrease-allowance (amount uint) (spender principal) (owner principal))
  (let ((allowance (allowance-of spender owner)))
    (if (or (> amount allowance) (<= amount u0))
      true
      (begin
        (map-set allowances
          ((spender spender) (owner owner))
          ((allowance (- allowance amount))))
        true))))

;; Internal - Increase allowance of a specified spender.
(define-private (increase-allowance (amount uint) (spender principal) (owner principal))
  (let ((allowance (allowance-of spender owner)))
    (if (<= amount u0)
      false
      (begin
         (map-set allowances
          ((spender spender) (owner owner))
          ((allowance (+ allowance amount))))
        true))))

;; Public functions

;; Transfers tokens to a specified principal.
(define-public (transfer-token (amount uint) (recipient principal) )
  (transfer amount tx-sender recipient)
)

;; Transfers tokens to a specified principal, performed by a spender
(define-public (transfer-from (amount uint) (owner principal) (recipient principal) )
  (let ((allowance (allowance-of tx-sender owner)))
    (begin
      (if (or (> amount allowance) (<= amount u0))
        (err false)
        (if (and
            (unwrap! (transfer amount owner recipient) (err false))
            (decrease-allowance amount tx-sender owner))
        (ok true)
        (err false)))))
)

;; Update the allowance for a given spender
(define-public (approve (amount uint) (spender principal) )
  (if (and (> amount u0)
           (print (increase-allowance amount spender tx-sender )))
      (ok amount)
      (err false)))

;; Revoke a given spender
(define-public (revoke (spender principal))
  (let ((allowance (allowance-of spender tx-sender)))
    (if (and (> allowance u0)
             (decrease-allowance allowance spender tx-sender))
        (ok 0)
        (err false))))

(define-public (balance-of (owner principal))
  (begin
      (print owner)
      (ok (ft-get-balance fungible-token owner))
  )
)
;; Mint new tokens.
(define-private (mint (amount uint) (account principal))
  (if (<= amount u0)
      (err false)
      (begin
        (var-set total-supply (+ (var-get total-supply) amount))
        (ft-mint? fungible-token amount account)
        (ok amount))))

;; Initialize the contract
(begin
  (mint u200 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)
  (mint u100 'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9))
