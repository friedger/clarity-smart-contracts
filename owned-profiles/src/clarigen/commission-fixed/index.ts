import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { CommissionFixedContract } from './types';
import { CommissionFixedInterface } from './abi';
export type { CommissionFixedContract } from './types';

export const commissionFixedContract = (provider: BaseProvider) => {
  const contract = proxy<CommissionFixedContract>(CommissionFixedInterface, provider);
  return contract;
};

export const commissionFixedInfo: Contract<CommissionFixedContract> = {
  contract: commissionFixedContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/commission-fixed.clar',
};
