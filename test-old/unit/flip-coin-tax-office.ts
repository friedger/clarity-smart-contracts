import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";

class FlipCoinTaxOfficeProvider extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.flip-coin-tax-office",
      "experiments/flip-coin-tax-office.clar",
      provider
    );
  }
}

describe("flip coin tax office contract test suite", () => {
  let provider: Provider;
  let client: FlipCoinTaxOfficeProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinTaxOfficeProvider(provider);
    });

    it("should have a valid syntax", async () => {
      await client.checkContract();
      await client.deployContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("basic tests", () => {
    beforeEach(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinTaxOfficeProvider(provider);
      await client.deployContract();
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
