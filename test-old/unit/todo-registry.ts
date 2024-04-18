import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
  ResultInterface,
} from "@blockstack/clarity";
import { fail } from "assert";

class TodoRegistryProvider extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.panic",
      "experiments/todo-registry.clar",
      provider
    );
  }

  async register(name: string, url: string): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "register", args: [`"${name}"`, `"${url}"`] },
    });
    await tx.sign("ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M");
    return await this.submitTransaction(tx);
  }

  async ownerOf(name: string): Promise<Receipt> {
    const q = this.createQuery({
      method: { name: "owner-of", args: [`"${name}"`] },
    });
    return await this.submitQuery(q);
  }
}

describe("todo registry contract test suite", () => {
  let provider: Provider;
  let client: TodoRegistryProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new TodoRegistryProvider(provider);
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
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new TodoRegistryProvider(provider);
      await client.deployContract();
    });

    it("should register", async () => {
      const result = await client.register(
        "username.id",
        "https://example.com/todo"
      );
      assert(result.success, "but failed");
    });

    it("should find the owner", async () => {
      const result = await client.ownerOf("username.id");
      assert(result.success, "but failed");
      assert.equal(
        result.result,
        "(some ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)"
      );
    });

    after(async () => {
      await provider.close();
    });
  });
});
