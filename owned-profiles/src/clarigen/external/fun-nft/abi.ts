import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const FunNftInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [],
      "name": "mint",
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
          "name": "id",
          "type": "uint128"
        },
        {
          "name": "sender",
          "type": "principal"
        },
        {
          "name": "recipient",
          "type": "principal"
        }
      ],
      "name": "transfer",
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
      "access": "read_only",
      "args": [
        {
          "name": "account",
          "type": "principal"
        }
      ],
      "name": "get-balance",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-last-token-id",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-owner",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
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
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-token-uri",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "optional": {
                "string-ascii": {
                  "length": 12
                }
              }
            }
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": "principal",
      "name": "token-count",
      "value": "uint128"
    }
  ],
  "non_fungible_tokens": [
    {
      "name": "fun",
      "type": "uint128"
    }
  ],
  "variables": [
    {
      "access": "constant",
      "name": "CONTRACT-OWNER",
      "type": "principal"
    },
    {
      "access": "variable",
      "name": "last-id",
      "type": "uint128"
    }
  ]
};
