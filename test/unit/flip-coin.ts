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

  async flipCoin(): Promise<Receipt> {
    const query = this.createQuery({
      method: { name: "flip-coin", args: [] },
    });
    const res = await this.submitQuery(query);
    return res;
  }

  async isLastEven(buf: string): Promise<Receipt> {
    const query = this.createQuery({
      method: { name: "is-last-even", args: [`\"${buf}\"`] },
    });
    const res = await this.submitQuery(query);
    return res;
  }
}

describe("flip coin contract test suite", () => {
  let provider: Provider;
  let client: FlipCoinProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinProvider(provider);
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
      client = new FlipCoinProvider(provider);
      await client.deployContract();
    });

    /** Block data not available in VM */
    it("should flip a coin", async () => {
      try {
        await client.flipCoin();
      } catch (e) {
        assert(
          e.errorOutput.indexOf("Failed to get block data.") >= 0,
          "Block data available!"
        );
      }
    });

    it("should detect even char", async () => {
      const buf = "b";
      const result = await client.isLastEven(buf);

      assert(result.success, "but failed");
      assert(result.result === "true", "but failed");
    });

    it("should detect even char", async () => {
      const buf = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
      const result = await client.isLastEven(buf);

      assert(result.success, "but failed");
      assert(result.result === "true", "but failed");
    });

    it("should detect odd char", async () => {
      const buf = "a";
      const result = await client.isLastEven(buf);
      assert(result.success, "but failed");
      assert(result.result === "false", "but failed");
    });

    it("should detect odd char", async () => {
      const buf = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const result = await client.isLastEven(buf);
      assert(result.success, "but failed");
      assert(result.result === "false", "but failed");
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
