import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { NftTraitContract } from './types';
import { NftTraitInterface } from './abi';
export type { NftTraitContract } from './types';

export const nftTraitContract = (provider: BaseProvider) => {
  const contract = proxy<NftTraitContract>(NftTraitInterface, provider);
  return contract;
};

export const nftTraitInfo: Contract<NftTraitContract> = {
  contract: nftTraitContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/external/nft-trait.clar',
};
