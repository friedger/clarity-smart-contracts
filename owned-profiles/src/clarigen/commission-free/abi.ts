import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const CommissionFreeInterface: ClarityAbi = {
  "functions": [
    {
      "access": "read_only",
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
      "name": "pay",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "bool"
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};
