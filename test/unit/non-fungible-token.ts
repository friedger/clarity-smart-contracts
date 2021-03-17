import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";

import { assert, expect } from "chai";

describe("oi license contract test suite", () => {
  let client: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(
      "SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4.non-fungible-token",
      "../contracts/tokens/non-fungible-token.clar",
      provider
    );
    await new Client(
      "SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4.nft-trait",
      "../contracts/sips/nft-trait.clar",
      provider
    ).deployContract();
  });

  it("should have a valid syntax", async () => {
    await client.deployContract();
  });

  it("should transfer", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "transfer",
        args: ["u1", "'ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M", "'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9"],
      },
    });
    await tx.sign("ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M");
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

});
