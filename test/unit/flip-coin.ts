import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";

class FlipCoinProvider extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.flipcoin",
      "experiments/flip-coin.clar",
      provider
    );
  }

  async mineBlock(): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "tick", args: [] },
    });
    await tx.sign("ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M");
    const res = await this.submitTransaction(tx);
    console.log(res);
    return res;
  }

  async flipCoin(): Promise<Receipt> {
    const query = this.createQuery({
      method: { name: "flip-coin", args: [] },
    });
    const res = await this.submitQuery(query);
    console.log(res);
    return res;
  }
}

describe("oi license contract test suite", () => {
  let provider: Provider;
  let client: FlipCoinProvider;

  describe("basic tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinProvider(provider);
    });

    it("should have a valid syntax", async () => {
      await client.checkContract();
      await client.deployContract();
    });

    it("should flip a coin", async () => {
      await client.mineBlock();
      await client.mineBlock();
      await client.mineBlock();
      await client.flipCoin();
    });

    after(async () => {
      await provider.close();
    });
  });
});
