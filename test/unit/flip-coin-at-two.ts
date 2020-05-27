import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";

class FlipCoinClassicProvider extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-at-two",
      "experiments/flip-coin-at-two.clar",
      provider
    );
  }

  async bet(value: boolean) {
    const tx = this.createTransaction({
      method: {
        name: "bet",
        args: [
          `${value}`,
          "'S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-jackpot",
        ],
      },
    });
    tx.sign("S1G2081040G2081040G2081040G208105NK8PE5");
    return this.submitTransaction(tx);
  }
}

describe("flip coin tax office contract test suite", () => {
  let provider: Provider;
  let client: FlipCoinClassicProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinClassicProvider(provider);
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin",
        "experiments/flip-coin.clar",
        provider
      ).deployContract();
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
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("basic tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinClassicProvider(provider);
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin",
        "experiments/flip-coin.clar",
        provider
      ).deployContract();
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

      await client.deployContract();
    });

    it("should bet on true", async () => {
      console.log(await client.bet(true));
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
