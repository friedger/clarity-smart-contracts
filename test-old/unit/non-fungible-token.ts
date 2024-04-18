import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";

import { assert, expect } from "chai";

describe("non-fungible-token contract test suite", () => {
  let client: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(
      "ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0.non-fungible-token",
      "../contracts/tokens/non-fungible-token.clar",
      provider
    );
    await new Client(
      "ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0.nft-trait",
      "../contracts/sips/nft-trait.clar",
      provider
    ).deployContract();
  });

  it("should have a valid syntax", async () => {
    const result = await client.deployContract();
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

  it("should transfer", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "transfer",
        args: ["u1", "'STZMTMQW4HRVCSAK0ZVG16TDVPV9WRG4WSNFP51F", "'ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9"],
      },
    });
    await tx.sign("STZMTMQW4HRVCSAK0ZVG16TDVPV9WRG4WSNFP51F");
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

});
