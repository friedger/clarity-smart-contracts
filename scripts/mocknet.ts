import { pubKeyfromPrivKey, publicKeyToString } from "@stacks/transactions";

export const ADDR1 = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6";
export const ADDR2 = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y";
export const ADDR3 = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR";
export const ADDR4 = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP";

export const testnetKeys: { secretKey: string; stacksAddress: string }[] = [
  {
    secretKey:
      "cb3df38053d132895220b9ce471f6b676db5b9bf0b4adefb55f2118ece2478df01",
    stacksAddress: ADDR1,
  },
  {
    secretKey:
      "21d43d2ae0da1d9d04cfcaac7d397a33733881081f0b2cd038062cf0ccbb752601",
    stacksAddress: ADDR2,
  },
  {
    secretKey:
      "c71700b07d520a8c9731e4d0f095aa6efb91e16e25fb27ce2b72e7b698f8127a01",
    stacksAddress: ADDR3,
  },
  {
    secretKey:
      "e75dcb66f84287eaf347955e94fa04337298dbd95aa0dbb985771104ef1913db01",
    stacksAddress: ADDR4,
  },
];

export const testnetKeyMap: Record<
  string,
  { address: string; secretKey: string; pubKey: string }
> = Object.fromEntries(
  testnetKeys.map((t) => [
    t.stacksAddress,
    {
      address: t.stacksAddress,
      secretKey: t.secretKey,
      pubKey: publicKeyToString(pubKeyfromPrivKey(t.secretKey)),
    },
  ])
);
