import {
  Provider,
  ProviderRegistry,
  Result,
  Client,
  Receipt,
} from "@blockstack/clarity";

import { assert } from "chai";

class HodlTokenClient extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.hodl-token",
      "tokens/hodl-token.clar",
      provider
    );
  }

  async tokenName(): Promise<Receipt> {
    const tx = this.createQuery({
      method: { name: "name", args: [] },
    });
    return await this.submitQuery(tx);
  }
}

describe("hodle token contract test suite", () => {
  let tokenClient: HodlTokenClient;
  let provider: Provider;

  const addresses = [
    "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
    "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9",
  ];
  const alice = addresses[0]; // 200 tokens
  const bob = addresses[1]; // 100 tokens

  describe("formal tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      tokenClient = new HodlTokenClient(provider);
    });
    it("should have valid syntax", async () => {
      await tokenClient.checkContract();
      await tokenClient.deployContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("deployed contract tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      tokenClient = new HodlTokenClient(provider);
      await tokenClient.deployContract();
    });

    it("should return name", async () => {
      assert.equal("Hodl", (await tokenClient.tokenName()).result);
    });

    after(async () => {
      await provider.close();
    });
  });
});
