import { Provider, ProviderRegistry, Result } from "@blockstack/clarity";

import { FungibleTokenClient } from "../src/client/fungibleToken";
import { LicenseClient } from "../src/client/license";

import { assert } from "chai";

describe("oi license contract test suite", () => {
  let licenseClient: LicenseClient;
  let tokenClient: FungibleTokenClient;
  let provider: Provider;

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
    "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR"
  ];
  const alice = addresses[0]; // 200 tokens
  const bob = addresses[1]; // 100 tokens
  const zoe = addresses[2];

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    licenseClient = new LicenseClient(provider);
    tokenClient = new FungibleTokenClient(provider);
  });

  it("should have a valid syntax", async () => {
    await tokenClient.deployContract();
    await licenseClient.checkContract();
  });

  describe("deployed contract tests", () => {
    before(async () => {
      await licenseClient.deployContract();
    });

    it("should buy a license", async () => {
      const amountBefore = await tokenClient.balanceOf(alice);
      const price = await licenseClient.getPrice(1);
      const receipt = await licenseClient.buy(1, { sender: alice });
      assert.equal(receipt.success, true);
      assert.equal(
        Result.unwrap(receipt),
        "Transaction executed and committed. Returned: 100"
      );

      const amountAfter = await tokenClient.balanceOf(alice);
      assert.equal(amountAfter, amountBefore - price);
    });

    it("should not buy a license of invalid type", async () => {
      const receipt = await licenseClient.buy(0, { sender: alice });
      assert.equal(receipt.success, false);
      Result.match(
        receipt,
        () => {},
        err =>
          assert.equal(
            err.toString(),
            "ExecutionError: Execute expression on contract failed with bad output: Aborted: 2"
          )
      );
    });

    it("should not buy a license when insufficient funds", async () => {
      tokenClient.transfer(bob, 100, { sender: alice });
      const receipt = await licenseClient.buy(1, { sender: alice });
      assert.equal(receipt.success, false);
      Result.match(
        receipt,
        () => {},
        err =>
          assert.equal(
            err.toString(),
            "ExecutionError: Execute expression on contract failed with bad output: Aborted: 4"
          )
      );
    });

    it("should not have a valid license after 1 blocks", async () => {
      const receipt = await licenseClient.buy(2, { sender: bob });
      assert.equal(receipt.success, true);
      let hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, true);
      provider.mineBlock(0);
      hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, false);
      provider.mineBlock(0);
      hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, false);
    });
  });

  after(async () => {
    await provider.close();
  });
});
