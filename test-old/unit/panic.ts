import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
  ResultInterface,
} from "@blockstack/clarity";
import { fail } from "assert";

class PanicProvider extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.panic",
      "experiments/panic.clar",
      provider
    );
  }

  async panic(): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "panic", args: [] },
    });
    await tx.sign("ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M");
    return await this.submitTransaction(tx);
  }

  async panicReadOnly(): Promise<Receipt> {
    const q = this.createQuery({
      method: { name: "panic-read-only", args: [] },
    });
    return await this.submitQuery(q);
  }
}

describe("panic contract test suite", () => {
  let provider: Provider;
  let client: PanicProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new PanicProvider(provider);
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
      client = new PanicProvider(provider);
      await client.deployContract();
    });

    it("should panic", async () => {
      const result = await client.panic();
      assert(!result.success, "but succeeded");
      assert(result.error["name"] === "ExecutionError");
    });

    it("should panic read-only", async () => {
      try {
        await client.panicReadOnly();
        fail("should have thrown an error");
      } catch (e) {
        assert(e.name === "ExecutionError");
      }
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
