// Code generated with the stacksjs-helper-generator extension
// Manual edits will be overwritten

import { ClarityValue, BooleanCV, IntCV, UIntCV, BufferCV, OptionalCV, ResponseCV, PrincipalCV, ListCV, TupleCV, StringAsciiCV, StringUtf8CV } from "@stacks/transactions"

export namespace OwnedProfilesContract {
    export const address = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
    export const name = "owned-profiles";

    // Functions
    export namespace Functions {
        // delete-profile
        export namespace DeleteProfile {
            export const name = "delete-profile";

        }

        // register
        export namespace Register {
            export const name = "register";

            export interface RegisterArgs {
                ownable: ClarityValue,
                id: UIntCV,
            }

            export function args(args: RegisterArgs): ClarityValue[] {
                return [
                    args.ownable,
                    args.id,
                ];
            }

        }

        // resolve-principal-to-profile
        export namespace ResolvePrincipalToProfile {
            export const name = "resolve-principal-to-profile";

            export interface ResolvePrincipalToProfileArgs {
                user: PrincipalCV,
                ownable: ClarityValue,
            }

            export function args(args: ResolvePrincipalToProfileArgs): ClarityValue[] {
                return [
                    args.user,
                    args.ownable,
                ];
            }

        }

        // resolve-profile-to-principal
        export namespace ResolveProfileToPrincipal {
            export const name = "resolve-profile-to-principal";

            export interface ResolveProfileToPrincipalArgs {
                ownable: ClarityValue,
                id: UIntCV,
            }

            export function args(args: ResolveProfileToPrincipalArgs): ClarityValue[] {
                return [
                    args.ownable,
                    args.id,
                ];
            }

        }

        // get-unverified-profile
        export namespace GetUnverifiedProfile {
            export const name = "get-unverified-profile";

            export interface GetUnverifiedProfileArgs {
                user: PrincipalCV,
            }

            export function args(args: GetUnverifiedProfileArgs): ClarityValue[] {
                return [
                    args.user,
                ];
            }

        }

    }
}
