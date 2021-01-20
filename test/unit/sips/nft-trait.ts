import { Client, Provider, ProviderRegistry } from "@blockstack/clarity";
import { expect } from "chai";
describe("badges contract test suite", () => {
  let client: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(
      "S1G2081040G2081040G2081040G208105NK8PE5.nft-trait",
      "sips/nft-trait",
      provider
    );
  });

  it("should have a valid syntax", async () => {
    await client.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    before(async () => {
      const result = await client.deployContract();
      expect(result.success).to.be.true;
    });

    it("should know about trait", async () => {
      const result = await client.provider.evalRaw("(+ 1 2)");
      expect(result.success).to.be.true;
    });
  });
  after(async () => {
    await provider.close();
  });
});
