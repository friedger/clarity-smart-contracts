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

(define-fungible-token spendable-token)
(define-fungible-token hodl-token)



;; Public functions

;; Transfers tokens to a specified principal.
(define-public (transfer (recipient principal) (amount uint))
   (match (ft-transfer? spendable-token amount sender recipient)
    result (ok 'true)
    error (err 'false))
)

(define-public (hodl (amount uint))
  (begin
    (ft-transfer? spendable-token tx-sender bank-account amount)
    (ft-transfer? hodl-token  bank-account tx-sender amount)
  )
)

(define-public (unhodl (amount uint))
  (begin
    (ft-transfer? hodl-token tx-sender bank-account amount)
    (ft-transfer? spendable-token bank-account tx-sender amount)
  )
)

(define-public (balance-of (owner principal))
      (ok (+ (ft-get-balance spendable-token owner) (ft-get-balance hodl-token owner))
)

(define-public (hodl-balance-of (owner principal))
      (ok (ft-get-balance hodl-token owner))
)

;; Mint new tokens.
(define-private (mint (account principal) (amount uint))
    (err 'false)
    (begin
      (ft-mint? fungible-token amount account)
      (ft-mint? hodl-token amount bank-account)
      (ok amount)))

;; Initialize the contract
(begin
  (mint 'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M u20)
  (mint 'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9 u10))
