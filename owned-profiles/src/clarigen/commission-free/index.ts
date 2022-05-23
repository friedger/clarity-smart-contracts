import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { CommissionFreeContract } from './types';
import { CommissionFreeInterface } from './abi';
export type { CommissionFreeContract } from './types';

export const commissionFreeContract = (provider: BaseProvider) => {
  const contract = proxy<CommissionFreeContract>(CommissionFreeInterface, provider);
  return contract;
};

export const commissionFreeInfo: Contract<CommissionFreeContract> = {
  contract: commissionFreeContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/commission-free.clar',
};
