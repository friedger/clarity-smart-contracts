import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";

class FlipCoinDelegateProvider extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-delegate",
      "experiments/flip-coin-delegate.clar",
      provider
    );
  }

  async flipCoinDelegate() {
    const q = this.createQuery({
      method: {
        name: "flip-coin-delegate",
        args: [],
      },
    });
    return this.submitQuery(q);
  }
}

describe("flip coin tax office contract test suite", () => {
  let provider: Provider;
  let client: FlipCoinDelegateProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinDelegateProvider(provider);
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin",
        "experiments/flip-coin.clar",
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
      client = new FlipCoinDelegateProvider(provider);
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin",
        "experiments/flip-coin.clar",
        provider
      ).deployContract();

      await client.deployContract();
    });

    it("should check even ", async () => {
      console.log(await client.flipCoinDelegate());
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
