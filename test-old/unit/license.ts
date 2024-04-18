import { Provider, ProviderRegistry, Result } from "@blockstack/clarity";

import { LicenseClient } from "../../src/client/license";

import { assert } from "chai";

describe("oi license contract test suite", () => {
  let licenseClient: LicenseClient;
  let provider: Provider;

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
    "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
  ];
  const alice = addresses[0]; // 200 tokens
  const bob = addresses[1]; // 100 tokens
  const zoe = addresses[2];

  describe("basic tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      licenseClient = new LicenseClient(provider);
    });

    it("should have a valid syntax", async () => {
      await licenseClient.checkContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("deployed contract tests", () => {
    beforeEach(async () => {
      provider = await ProviderRegistry.createProvider();
      licenseClient = new LicenseClient(provider);
      await licenseClient.deployContract();
    });

    it("should buy a license", async () => {
      const amountBefore = await licenseClient.stxGetBalance(alice);
      const price = await licenseClient.getPrice(1);
      const receipt = await licenseClient.buyNonExpiring({ sender: alice });
      console.log(receipt);
      assert.equal(receipt.success, true);
      assert.equal(
        Result.unwrap(receipt),
        "Transaction executed and committed. Returned: 100"
      );

      const amountAfter = await licenseClient.stxGetBalance(alice);
      assert.equal(amountAfter, amountBefore - price);
    });

    it("should not buy a license if user has an non-expiring license", async () => {
      const amountBefore = await licenseClient.stxGetBalance(alice);
      const receipt0 = await licenseClient.buyNonExpiring({ sender: alice });
      assert.equal(
        receipt0.success,
        true,
        `precondition failed: buying non-exipring ${receipt0.error}`
      );

      const receipt = await licenseClient.buyExpiring(1, { sender: alice });
      assert.equal(receipt.success, false);
      Result.match(
        receipt,
        () => {},
        (err) =>
          assert.equal(
            err.toString(),
            "ExecutionError: Execute expression on contract failed with bad output: Aborted: 5"
          )
      );
      const amountAfter = await licenseClient.stxGetBalance(alice);
      assert.equal(amountAfter, amountBefore);
    });

    it("should not buy a license when insufficient funds", async () => {
      await licenseClient.stxTransfer(bob, 100, { sender: alice });
      const receipt = await licenseClient.buyNonExpiring({ sender: alice });
      assert.equal(receipt.success, false);
      Result.match(
        receipt,
        () => {},
        (err) =>
          assert.equal(
            err.toString(),
            "ExecutionError: Execute expression on contract failed with bad output: Aborted: 4"
          )
      );
    });

    it("should not have a valid license after 1 blocks", async () => {
      const duration = 1;
      const receipt = await licenseClient.buyExpiring(duration, {
        sender: bob,
      });
      assert.equal(receipt.success, true);

      let hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, true);
      await licenseClient.mineBlock();
      hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, false);
      await licenseClient.mineBlock();
      hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, false);
    });

    it("should not have a valid license after 2 blocks", async () => {
      const duration = 2;
      const receipt = await licenseClient.buyExpiring(duration, {
        sender: bob,
      });
      assert.equal(receipt.success, true);
      console.log(await licenseClient.getBlockHeight());
      console.log(await licenseClient.getLicense(bob));
      let hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, true);
      await licenseClient.mineBlock();
      hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, true);
      await licenseClient.mineBlock();
      hasValidLicense = await licenseClient.hasValidLicense(bob);
      assert.equal(hasValidLicense, false);
    });
  });

  afterEach(async () => {
    await provider.close();
  });
});
