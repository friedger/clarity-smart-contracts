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

;;;; Rocket-Token

(define-fungible-token rocket-token)
(define-map balances
  ((owner principal))
  ((balance uint)))
(define-data-var total-supply uint u30)

(define-constant err-min-transfer u10)

(define-public (get-total-supply)
  (ok (var-get total-supply))
)

(define-public (get-balance (account principal))
  (ok
    (ft-get-balance rocket-token account)
  )
)

(define-public (transfer? (sender principal) (receiver principal) (amount uint))
  (begin
    (if (> amount u0)
      (match (ft-transfer? rocket-token amount sender receiver)
        success (ok success)
        error (err (+ err-min-transfer error)))
      (err err-min-transfer)
    )
  )
)

;; Initialize the contract
(begin
  (ft-mint? rocket-token u20 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7) ;; alice
  (ft-mint? rocket-token u10 'S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE) ;; bob
)
