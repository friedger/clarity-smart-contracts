import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";

class ListProvider extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.list",
      "experiments/lists.clar",
      provider
    );
  }

  async append(): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "append-item", args: ["(list u10 u9)", "u8"] },
    });
    await tx.sign("ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M");
    return await this.submitTransaction(tx);
  }

  async appendReadOnly(): Promise<Receipt> {
    const tx = this.createQuery({
      method: { name: "append-item", args: ["(list u10 u9)", "u8"] },
    });
    return await this.submitQuery(tx);
  }

  async bar(): Promise<Receipt> {
    const q = this.createTransaction({
      method: { name: "bar", args: [] },
    });
    return await this.submitQuery(q);
  }
}

describe("list contract test suite", () => {
  let provider: Provider;
  let client: ListProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new ListProvider(provider);
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
      client = new ListProvider(provider);
      await client.deployContract();
    });

    it("should append", async () => {
      const result = await client.append();
      console.log(result);
      assert(result.success, "but failed");
    });

    it("should append", async () => {
      const result = await client.appendReadOnly();
      console.log(result);
      assert(result.success, "but failed");
    });

    it("should foo bar", async () => {
      const result = await client.bar();
      console.log(result);
      assert(result.success, "but failed");
    });
    afterEach(async () => {
      await provider.close();
    });
  });
});
