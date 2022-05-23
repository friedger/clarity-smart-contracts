import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface OwnedProfilesContract {

  delete: () => Transaction<boolean, null>;
  deleteAndBlock: (ownable: string) => Transaction<boolean, bigint>;
  register: (ownable: string, id: number | bigint, commission: string) => Transaction<boolean, bigint>;
  resolvePrincipalToProfile: (user: string, ownable: string) => Transaction<{
  "contract": string;
  "id": bigint
    } | null, null>;
  resolveProfileToPrincipal: (ownable: string, id: number | bigint) => Transaction<string | null, bigint>;
  getProfileBlockedUntil: (ownable: string, id: number | bigint) => Promise<bigint | null>;
  getUnverifiedProfile: (user: string) => Promise<{
  "contract": string;
  "id": bigint
    } | null>;
  isProfileReady: (profile: {
  "contract": string;
  "id": bigint
    }) => Promise<boolean>;
}
