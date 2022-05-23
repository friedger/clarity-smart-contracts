import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const CommissionFixedInterface: ClarityAbi = {
  "functions": [
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
      "name": "pay",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": [
    {
      "access": "constant",
      "name": "deployer",
      "type": "principal"
    }
  ]
};
