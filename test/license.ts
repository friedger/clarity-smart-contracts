import {
  Client,
  Provider,
  ProviderRegistry,
  Result
} from "@blockstack/clarity";

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
  const alice = addresses[0]; // 20 tokens
  const bob = addresses[1]; // 10 tokens
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
      const price = await licenseClient.getPrice(1)

      const receipt = await licenseClient.buy(1, {sender:alice})
      console.log(receipt);
      assert.equal(receipt.success, true);
      assert.equal(
        Result.unwrap(receipt),
        "Transaction executed and committed. Returned: (some 1)"
      );

      const amountAfter = await tokenClient.balanceOf(alice);
      assert.equal(amountAfter, amountBefore - price);
    });
  });

  after(async () => {
    await provider.close();
  });
});
