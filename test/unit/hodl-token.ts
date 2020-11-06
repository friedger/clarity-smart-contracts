import {
  Provider,
  ProviderRegistry,
  Result,
  Client,
  Receipt,
  unwrapResult,
} from "@blockstack/clarity";

import { assert } from "chai";
import { providerWithInitialAllocations } from "./providerWithInitialAllocations";

class HodlTokenClient extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.hodl-token",
      "tokens/hodl-token.clar",
      provider
    );
  }

  async tokenName(): Promise<Receipt> {
    const tx = this.createQuery({
      method: { name: "name", args: [] },
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
      await tokenClient.deployContract();
    });

    it("should return name", async () => {
      assert.equal(
        `(ok 0x${Buffer.from("Hodl").toString("hex")})`,
        unwrapResult(await tokenClient.tokenName())
      );
    });

    it("should buy hodl tokens", async () => {
      const result = await tokenClient.buyTokens(10, { sender: alice });
      assert.equal(
        'Transaction executed and committed. Returned: u10\n[STXEvent(STXTransferEvent(STXTransferEventData { sender: Standard(StandardPrincipalData(26, [210, 137, 135, 159, 210, 247, 227, 61, 194, 243, 163, 67, 70, 194, 6, 243, 93, 231, 54, 150])), recipient: Standard(StandardPrincipalData(26, [68, 239, 37, 48, 201, 61, 59, 1, 150, 19, 31, 195, 101, 214, 229, 196, 200, 111, 28, 153])), amount: 10 })), FTEvent(FTMintEvent(FTMintEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(26, [210, 137, 135, 159, 210, 247, 227, 61, 194, 243, 163, 67, 70, 194, 6, 243, 93, 231, 54, 150]), name: ContractName("hodl-token") }, asset_name: ClarityName("spendable-token") }, recipient: Standard(StandardPrincipalData(26, [210, 137, 135, 159, 210, 247, 227, 61, 194, 243, 163, 67, 70, 194, 6, 243, 93, 231, 54, 150])), amount: 10 })), FTEvent(FTMintEvent(FTMintEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(26, [210, 137, 135, 159, 210, 247, 227, 61, 194, 243, 163, 67, 70, 194, 6, 243, 93, 231, 54, 150]), name: ContractName("hodl-token") }, asset_name: ClarityName("hodl-token") }, recipient: Contract(QualifiedContractIdentifier { issuer: StandardPrincipalData(26, [210, 137, 135, 159, 210, 247, 227, 61, 194, 243, 163, 67, 70, 194, 6, 243, 93, 231, 54, 150]), name: ContractName("hodl-token") }), amount: 10 }))]',
        result.result
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
