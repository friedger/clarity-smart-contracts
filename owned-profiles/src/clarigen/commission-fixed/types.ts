import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface CommissionFixedContract {
  pay: (ownable: string, id: number | bigint) => Transaction<boolean, bigint>;
}
