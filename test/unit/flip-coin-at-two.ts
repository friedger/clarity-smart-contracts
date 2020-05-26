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
      "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-at-two",
      "experiments/flip-coin-at-two.clar",
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
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-tax-office",
        "experiments/flip-coin-tax-office.clar",
        provider
      ).deployContract();
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-jackpot",
        "experiments/flip-coin-jackpot.clar",
        provider
      ).deployContract();
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
