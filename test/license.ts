import {
  Client,
  Provider,
  ProviderRegistry,
  Result
} from "@blockstack/clarity";

import { assert } from "chai";

describe("oi license contract test suite", () => {
  let licenseClient: Client;
  let tokenClient: Client;
  let provider: Provider;

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
    "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR"
  ];
  const alice = addresses[0];
  const bob = addresses[1];
  const zoe = addresses[2];

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    licenseClient = new Client("oi-license", "license/license", provider);
    tokenClient = new Client("token", "license/fungible-token", provider);
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
      const transaction = licenseClient.createTransaction({
        method: { name: "buy", args: ["1"] }
      });
      await transaction.sign(alice)
      const receipt = await licenseClient.submitTransaction(transaction);
      console.log(receipt)
      assert.equal(receipt.success, true);
      assert.equal(Result.unwrap(receipt), "100")
    });
  });

  after(async () => {
    await provider.close();
  });
});
