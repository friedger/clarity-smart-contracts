import { ownedProfilesInfo } from './owned-profiles';
import { commissionFreeInfo } from './commission-free';
import { commissionFixedInfo } from './commission-fixed';
import { nftTraitInfo } from './external/nft-trait';
import { funNftInfo } from './external/fun-nft';
export type { OwnedProfilesContract } from './owned-profiles';
export type { CommissionFreeContract } from './commission-free';
export type { CommissionFixedContract } from './commission-fixed';
export type { NftTraitContract } from './external/nft-trait';
export type { FunNftContract } from './external/fun-nft';

export const contracts = {
  ownedProfiles: ownedProfilesInfo,
  commissionFree: commissionFreeInfo,
  commissionFixed: commissionFixedInfo,
  nftTrait: nftTraitInfo,
  funNft: funNftInfo,
};

// prettier-ignore
export const accounts = {
  "deployer": {
    mnemonic: "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw",
    balance: 100000000000000n,
    address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  },
  "wallet_1": {
    mnemonic: "sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild",
    balance: 100000000000000n,
    address: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
  },
  "wallet_2": {
    mnemonic: "hold excess usual excess ring elephant install account glad dry fragile donkey gaze humble truck breeze nation gasp vacuum limb head keep delay hospital",
    balance: 100000000000000n,
    address: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
  },
  "wallet_3": {
    mnemonic: "cycle puppy glare enroll cost improve round trend wrist mushroom scorpion tower claim oppose clever elephant dinosaur eight problem before frozen dune wagon high",
    balance: 100000000000000n,
    address: "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC",
  },
  "wallet_4": {
    mnemonic: "board list obtain sugar hour worth raven scout denial thunder horse logic fury scorpion fold genuine phrase wealth news aim below celery when cabin",
    balance: 100000000000000n,
    address: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
  },
  "wallet_5": {
    mnemonic: "hurry aunt blame peanut heavy update captain human rice crime juice adult scale device promote vast project quiz unit note reform update climb purchase",
    balance: 100000000000000n,
    address: "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB",
  },
  "wallet_6": {
    mnemonic: "area desk dutch sign gold cricket dawn toward giggle vibrant indoor bench warfare wagon number tiny universe sand talk dilemma pottery bone trap buddy",
    balance: 100000000000000n,
    address: "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
  },
  "wallet_7": {
    mnemonic: "prevent gallery kind limb income control noise together echo rival record wedding sense uncover school version force bleak nuclear include danger skirt enact arrow",
    balance: 100000000000000n,
    address: "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ",
  },
  "wallet_8": {
    mnemonic: "female adjust gallery certain visit token during great side clown fitness like hurt clip knife warm bench start reunion globe detail dream depend fortune",
    balance: 100000000000000n,
    address: "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
  },
  "wallet_9": {
    mnemonic: "shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform",
    balance: 100000000000000n,
    address: "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6",
  },
};
