import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const OwnedProfilesInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [],
      "name": "delete",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "ownable",
          "type": "trait_reference"
        },
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "register",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "user",
          "type": "principal"
        },
        {
          "name": "ownable",
          "type": "trait_reference"
        }
      ],
      "name": "resolve-principal-to-profile",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "optional": {
                "tuple": [
                  {
                    "name": "contract",
                    "type": "principal"
                  },
                  {
                    "name": "id",
                    "type": "uint128"
                  }
                ]
              }
            }
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "ownable",
          "type": "trait_reference"
        },
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "resolve-profile-to-principal",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "optional": "principal"
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "user",
          "type": "principal"
        }
      ],
      "name": "get-unverified-profile",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "contract",
                "type": "principal"
              },
              {
                "name": "id",
                "type": "uint128"
              }
            ]
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": {
        "tuple": [
          {
            "name": "contract",
            "type": "principal"
          },
          {
            "name": "id",
            "type": "uint128"
          }
        ]
      },
      "name": "profile-user",
      "value": "principal"
    },
    {
      "key": "principal",
      "name": "user-profile",
      "value": {
        "tuple": [
          {
            "name": "contract",
            "type": "principal"
          },
          {
            "name": "id",
            "type": "uint128"
          }
        ]
      }
    }
  ],
  "non_fungible_tokens": [],
  "variables": [
    {
      "access": "constant",
      "name": "err-not-authorized",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "err-not-found",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    }
  ]
};
