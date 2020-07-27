import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";

class MonsterClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.monster",
      "monsters/monsters.clar",
      provider
    );
  }
}

class MarketClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.market",
      "monsters/market.clar",
      provider
    );
  }
}

describe("monster contract test suite", () => {
  let provider: Provider;
  let monsterClient: MonsterClient;
  let marketClient: MarketClient;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
    });

    it("should have a valid syntax", async () => {
      await monsterClient.checkContract();
      await monsterClient.deployContract();
      await marketClient.checkContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("basic tests", () => {
    beforeEach(async () => {
      provider = await ProviderRegistry.createProvider();
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
      await monsterClient.deployContract();
      await marketClient.deployContract();
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
