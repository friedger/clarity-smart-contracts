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
      "SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4.friedger-pool",
      "../contracts/tokens/friedger-pool-nft.clar",
      provider
    );
    await new Client(
      "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait",
      "../contracts/sips/nft-trait.clar",
      provider
    ).deployContract();
  });

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "SP103VXJR1E4KHSF19KKDXN1BNAG3HHRMD5QWDCNY",
    "SP1308DQKXZK593BES4GV419HMM3X94MM3TSVFA88",
    "SPZX7DMGEHBBEN7FD7T3FZVS8P7WAYKB04531877"
  ];

  it("should have a valid syntax", async () => {
    await client.deployContract();
  });

  it("should not claim nfts", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "claim",
        args: ["u1"],
      },
    });
    await tx.sign(addresses[0]);
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.false;
  });

  it("should claim nfts", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "claim",
        args: ["u1"],
      },
    });
    await tx.sign(addresses[1]);
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

  it("should claim nfts", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "claim",
        args: ["u1"],
      },
    });
    await tx.sign(addresses[2]);
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

  it("should claim nfts", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "claim",
        args: ["u0"],
      },
    });
    await tx.sign(addresses[3]);
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  });

  it ("should not transfer", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "transfer",
        args: ["u1", `'${addresses[1]}`, `'${addresses[0]}`],
      },
    });
    await tx.sign(addresses[2]);
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.false;
  })

  it ("should transfer", async () => {
    const tx = await client.createTransaction({
      method: {
        name: "transfer",
        args: ["u1", `'${addresses[1]}`, `'${addresses[0]}`],
      },
    });
    await tx.sign(addresses[1]);
    const result = await client.submitTransaction(tx);
    console.log(result)
    expect(result.success, JSON.stringify(result)).to.be.true;
  })
});
