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

  async getHeaderHash(atBlock: number): Promise<string> {
    const response = await this.provider.eval(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.flipcoin",
      `(get-block-info? header-hash u${atBlock})`
    );
    return response.result.substr(8, 64); // remove (some ) from result
  }

  async flipCoin(atBlock: number): Promise<Receipt> {
    const query = this.createQuery({
      method: { name: "flip-coin-at", args: [`u${atBlock}`] },
    });
    const res = await this.submitQuery(query);
    return res;
  }

  async isLastEven(buf: string): Promise<Receipt> {
    const query = this.createQuery({
      method: {
        name: "is-last-even",
        args: [buf],
      },
    });
    const res = await this.submitQuery(query);
    return res;
  }

  async mineBlock(): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "invalid-function-name",
        args: [],
      },
    });
    await tx.sign("ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M");
    return this.submitTransaction(tx);
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
      const headerHash1 = await client.getHeaderHash(1);
      const lastByte1 = Buffer.from(headerHash1, "hex")[31];
      const flip1 = await client.flipCoin(1);
      assert(flip1.result === (lastByte1 % 2 === 0).toString());

      await client.mineBlock();
      const headerHash2 = await client.getHeaderHash(2);
      const lastByte2 = Buffer.from(headerHash2, "hex")[31];
      const flip2 = await client.flipCoin(2);
      assert(flip2.result === (lastByte2 % 2 === 0).toString());
    });

    it("should detect not even char 0b", async () => {
      const buf = "0x0b";
      const result = await client.isLastEven(buf);
      assert(result.success, `but failed ${result}`);
      assert(result.result === "false", "but failed");
    });

    it("should detect not even char bb", async () => {
      const buf = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
      const result = await client.isLastEven(buf);

      assert(result.success, "but failed");
      assert(result.result === "false", "but failed");
    });

    it("should detect even char 0a", async () => {
      const buf = "0x0a";
      const result = await client.isLastEven(buf);
      assert(result.success, "but failed");
      assert(result.result === "true", "but failed");
    });

    it("should detect even char aa", async () => {
      const buf = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const result = await client.isLastEven(buf);
      assert(result.success, "but failed");
      assert(result.result === "true", "but failed");
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
