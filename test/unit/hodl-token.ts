import {
  Provider,
  ProviderRegistry,
  Result,
  Client,
  Receipt,
  unwrapResult,
} from "@blockstack/clarity";

import { assert, expect } from "chai";
import { providerWithInitialAllocations } from "./providerWithInitialAllocations";

class HodlTokenClient extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.hodl-token",
      "tokens/hodl-token.clar",
      provider
    );
  }

  async getName(): Promise<Receipt> {
    const tx = this.createQuery({
      method: { name: "get-name", args: [] },
    });
    return await this.submitQuery(tx);
  }

  async buyTokens(
    amount: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "buy-tokens", args: [`u${amount}`] },
    });
    await tx.sign(params.sender);
    return await this.submitTransaction(tx);
  }
}

describe("hodle token contract test suite", () => {
  let tokenClient: HodlTokenClient;
  let provider: Provider;

  const addresses = [
    "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M",
    "ST1JDEC841ZDWN9CKXKJMDQGP5TW1AM10B7EV0DV9",
  ];
  const alice = addresses[0]; // 200 tokens
  const bob = addresses[1]; // 100 tokens

  describe("formal tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      tokenClient = new HodlTokenClient(provider);
      (await new Client(
        "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard",
        "../contracts/sips/ft-trait.clar",
        provider
      ).deployContract());
    });
    it("should have valid syntax", async () => {
      await tokenClient.checkContract();
      await tokenClient.deployContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("deployed contract tests", () => {
    before(async () => {
      ProviderRegistry.registerProvider(
        providerWithInitialAllocations([{ principal: alice, amount: 10000 }])
      );
      provider = await ProviderRegistry.createProvider();
      tokenClient = new HodlTokenClient(provider);
      (await new Client(
        "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard",
        "../contracts/sips/ft-trait.clar",
        provider
      ).deployContract());
      await tokenClient.deployContract();
    });

    it("should return name", async () => {
      assert.equal(`(ok "Hodl")`, unwrapResult(await tokenClient.getName()));
    });

    it("should buy hodl tokens", async () => {
      const receipt = await tokenClient.buyTokens(10, { sender: alice });
      expect(receipt.result).equal(
        'Transaction executed and committed. Returned: u10\n[STXEvent(STXTransferEvent(STXTransferEventData { sender: Standard(StandardPrincipalData(ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)), recipient: Standard(StandardPrincipalData(ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV)), amount: 10 })), FTEvent(FTMintEvent(FTMintEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M), name: ContractName("hodl-token") }, asset_name: ClarityName("spendable-token") }, recipient: Standard(StandardPrincipalData(ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M)), amount: 10 })), FTEvent(FTMintEvent(FTMintEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M), name: ContractName("hodl-token") }, asset_name: ClarityName("hodl-token") }, recipient: Contract(QualifiedContractIdentifier { issuer: StandardPrincipalData(ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M), name: ContractName("hodl-token") }), amount: 10 }))]'
      );
      const result1 = await provider.eval(
        "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.hodl-token",
        `(stx-get-balance '${alice})`
      );
      assert.equal("u9990", result1.result);
    });

    after(async () => {
      await provider.close();
    });
  });
});
