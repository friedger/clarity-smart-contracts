import { pubKeyfromPrivKey, publicKeyToString } from "@stacks/transactions";

// from public Stacks.toml file
export const ADDR1 = "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH";
export const ADDR2 = "ST26FVX16539KKXZKJN098Q08HRX3XBAP541MFS0P";
export const ADDR3 = "ST3CECAKJ4BH08JYY7W53MC81BYDT4YDA5M7S5F53";
export const ADDR4 = "ST31HHVBKYCYQQJ5AQ25ZHA6W2A548ZADDQ6S16GP";
export const testnetKeys: { secretKey: string; stacksAddress: string }[] = [
  {
    secretKey:
      "b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001",
    stacksAddress: ADDR1,
  },
  {
    secretKey:
      "3a4e84abb8abe0c1ba37cef4b604e73c82b1fe8d99015cb36b029a65099d373601",
    stacksAddress: ADDR2,
  },
  {
    secretKey:
      "052cc5b8f25b1e44a65329244066f76c8057accd5316c889f476d0ea0329632c01",
    stacksAddress: ADDR3,
  },
  {
    secretKey:
      "9aef533e754663a453984b69d36f109be817e9940519cc84979419e2be00864801",
    stacksAddress: ADDR4,
  },
];

export const testnetKeyMap: Record<
  string,
  { stacks: string; private: string; public: string }
> = Object.fromEntries(
  testnetKeys.map((t) => [
    t.stacksAddress,
    {
      stacks: t.stacksAddress,
      private: t.secretKey,
      public: publicKeyToString(pubKeyfromPrivKey(t.secretKey)),
    },
  ])
);
