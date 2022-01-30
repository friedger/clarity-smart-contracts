import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { FunNftContract } from './types';
import { FunNftInterface } from './abi';
export type { FunNftContract } from './types';

export const funNftContract = (provider: BaseProvider) => {
  const contract = proxy<FunNftContract>(FunNftInterface, provider);
  return contract;
};

export const funNftInfo: Contract<FunNftContract> = {
  contract: funNftContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/external/fun-nft.clar',
};
