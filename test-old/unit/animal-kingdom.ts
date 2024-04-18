import { Provider, ProviderRegistry, Result } from "@blockstack/clarity";

import { AnimalKingdomsClient } from "../../src/client/animalKingdoms";

import { assert } from "chai";

describe("Animal kingdoms contract test suite", () => {
  let client: AnimalKingdomsClient;
  let provider: Provider;

  const addresses = [
    "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9",
    "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
  ];
  const alice = addresses[0];
  const owner = addresses[1];

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new AnimalKingdomsClient(provider);
  });

  it("should have a valid syntax", async () => {
    await client.checkContract();
  });

  describe("deployed contract tests", () => {
    before(async () => {
      await client.deployContract();
    });

    it("should mint a new token", async () => {
      const result = await client.register("planet.friedger.de", {
        sender: owner,
      });
      assert.equal(result.success, true);
    });
  });

  after(async () => {
    await provider.close();
  });
});
