import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface CommissionFreeContract {
  pay: (ownable: string, id: number | bigint) => Promise<ClarityTypes.Response<boolean, null>>;
}
