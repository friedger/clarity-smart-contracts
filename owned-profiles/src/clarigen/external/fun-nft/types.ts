import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface FunNftContract {
  mint: () => Transaction<boolean, bigint>;
  transfer: (id: number | bigint, sender: string, recipient: string) => Transaction<boolean, bigint>;
  getBalance: (account: string) => Promise<bigint>;
  getLastTokenId: () => Promise<ClarityTypes.Response<bigint, null>>;
  getOwner: (id: number | bigint) => Promise<ClarityTypes.Response<string | null, null>>;
  getTokenUri: (id: number | bigint) => Promise<ClarityTypes.Response<string | null, null>>;
}
