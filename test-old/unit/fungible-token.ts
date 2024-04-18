import { Provider, ProviderRegistry, Result } from "@blockstack/clarity";

import { FungibleTokenClient } from "../../src/client/fungibleToken";

import { assert } from "chai";

describe("fungible token contract test suite", () => {
  let tokenClient: FungibleTokenClient;
  let provider: Provider;

  const addresses = [
    "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
    "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9",
  ];
  const alice = addresses[0]; // 200 tokens
  const bob = addresses[1]; // 100 tokens

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    tokenClient = new FungibleTokenClient(provider);
  });

  it("should use valid token", async () => {
    await tokenClient.checkContract();
  });

  describe("deployed contract tests", () => {
    before(async () => {
      await tokenClient.deployContract();
    });

    it("should transfer token", async () => {
      const amountBefore = await tokenClient.balanceOf(alice);
      const receipt = await tokenClient.transfer(bob, 10, { sender: alice });
      assert.equal(receipt.success, true);
      const amountAfter = await tokenClient.balanceOf(alice);
      assert.equal(amountAfter, amountBefore - 10);
    });
  });

  after(async () => {
    await provider.close();
  });
});
