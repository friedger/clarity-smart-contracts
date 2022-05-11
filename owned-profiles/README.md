Owned Profiles
==============

Currently, user profiles can be registered and edited via BNS, zonefiles and
signed public profiles. However, applications can't edit profiles because it
requires access to the users data private key to write to gaia and to signed the
public profile as JWT.

Owned profiles is a protocol to register an profile via a smart contract, it is
light weight and inspired by BNS.

An owned profile can be any smart contract with a function `get-owner` that
takes an id as `uint` and returns the owner principal. Typically, this is a
SIP-009 NFT. The protocol is open to future SIPs that define other profiles.

The following rules apply:
* only owned profiles can be registered.
* registered profiles can be deleted.
* profiles do not resolve to the registered principal if the principal does not
  owne it (anymore).
* profiles can be blocked for 4000 blocks so that new owners can't register it
  during the blocking period. This is to protect users from impersonation.
* apps can provide a commission fee paid during registration.


