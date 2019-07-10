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

;; Storage
(define-map balances
  ((owner principal))
  ((balance int)))
(define-map allowances
  ((spender principal) (owner principal))
  ((allowance int)))
(define total-supply 0)

;; Internals

;; Total number of tokens in existence.
(define (get-total-supply)
  total-supply)

;; Gets the amount of tokens owned by the specified address.
(define (balance-of (account principal))
  (default-to 0
    (get balance
         (fetch-entry balances ((owner account))))))

;; Gets the amount of tokens that an owner allowed to a spender.
(define (allowance-of (spender principal) (owner principal))
  (default-to 0
    (get allowance
         (fetch-entry allowances (
                                  (owner owner)
                                  (spender spender))))))

;; Credits balance of a specified principal.
(define (credit-balance! (account principal) (amount int))
  (if (<= amount 0)
    'false
    (let ((current-balance (balance-of account)))
      (begin
        (set-entry! balances
          ((owner account))
          ((balance (+ amount current-balance))))
        'true)))) ;; Overflow management?

;; Debits balance of a specified principal.
(define (debit-balance! (account principal) (amount int))
  (let ((balance (balance-of account)))
    (if (or (> amount balance) (<= amount 0))
      'false
      (begin
        (set-entry! balances
          ((owner account))
          ((balance (- balance amount))))
        'true))))

;; Transfers tokens to a specified principal.
(define (transfer! (sender principal) (recipient principal) (amount int))
  (if (and
        (not (eq? sender recipient))
        (debit-balance! sender amount)
        (credit-balance! recipient amount))
    'true
    'false))

;; Decrease allowance of a specified spender.
(define (decrease-allowance! (spender principal) (owner principal) (amount int))
  (let ((allowance (allowance-of spender owner)))
    (if (or (> amount allowance) (<= amount 0))
      'true
      (begin
        (set-entry! allowances
          ((spender spender) (owner owner))
          ((allowance (- allowance amount))))
        'true))))

;; Internal - Increase allowance of a specified spender.
(define (increase-allowance! (spender principal) (owner principal) (amount int))
  (let ((allowance (allowance-of spender owner)))
    (if (<= amount 0)
      'false
      (begin
        (set-entry! allowances
          ((spender spender) (owner owner))
          ((allowance (+ allowance amount))))
        'true))))

;; Public functions

;; Transfers tokens to a specified principal.
(define-public (transfer (recipient principal) (amount int))
  (if (transfer! tx-sender recipient amount)
      (ok amount)
      (err 'false)))

;; Transfers tokens to a specified principal, performed by a spender
(define-public (transfer-from (owner principal) (recipient principal) (amount int))
  (let ((allowance (allowance-of tx-sender owner)))
    (if (or (> amount allowance) (<= amount 0))
      (err 'false)
      (if (and
           (transfer! owner recipient amount)
           (decrease-allowance! tx-sender owner amount))
       (ok amount)
       (err 'false)))))

;; Update the allowance for a given spender
(define-public (approve (spender principal) (amount int))
  (if (and (> amount 0)
           (increase-allowance! spender tx-sender amount))
      (ok amount)
      (err 'false)))

;; Revoke a given spender
(define-public (revoke (spender principal))
  (let ((allowance (allowance-of spender tx-sender)))
    (if (and (> allowance 0)
             (decrease-allowance! spender tx-sender allowance))
        (ok 0)
        (err 'false))))

;; Mint new tokens.
(define (mint! (account principal) (amount int))
  (if (<= amount 0)
      (err 'false)
      (let ((balance (balance-of account)))
        (begin
          (set-entry! balances
                      ((owner account))
                      ((balance (+ balance amount))))
          (ok amount)))))

;; Initialize the contract
(begin
  (mint! 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7 20)
  (mint! 'S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE 10))
