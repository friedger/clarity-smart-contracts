import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { OwnedProfilesContract } from './types';
import { OwnedProfilesInterface } from './abi';
export type { OwnedProfilesContract } from './types';

export const ownedProfilesContract = (provider: BaseProvider) => {
  const contract = proxy<OwnedProfilesContract>(OwnedProfilesInterface, provider);
  return contract;
};

export const ownedProfilesInfo: Contract<OwnedProfilesContract> = {
  contract: ownedProfilesContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/owned-profiles.clar',
};
