import { Provider, ProviderRegistry, Result } from "@blockstack/clarity";

import { FungibleTokenClient } from "../../src/client/fungibleToken";

import { assert } from "chai";

describe("fungible token contract test suite", () => {
  let tokenClient: FungibleTokenClient;
  let provider: Provider;

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
    "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
  ];
  const alice = addresses[0]; // 200 tokens
  const bob = addresses[1]; // 100 tokens
  const zoe = addresses[2];

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    tokenClient = new FungibleTokenClient(provider);
  });

  it("should use valid token", async () => {
    await tokenClient.deployContract();
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
