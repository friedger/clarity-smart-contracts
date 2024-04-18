import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";

import { assert, expect } from "chai";

describe("beeple contract test suite", () => {
  let client: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(
      "ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0.beeple",
      "../contracts/tokens/beeple.clar",
      provider
    );
    await new Client(
      "ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0.nft-trait",
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
        args: ["u1", "'ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0", "'STZMTMQW4HRVCSAK0ZVG16TDVPV9WRG4WSNFP51F"],
      },
    });
    await tx.sign("ST1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS54Q30F0");
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

});
