import { Client, Provider, Receipt, Result } from "@blockstack/clarity";

export class AnimalKingdomsClient extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.animal-kingdom",
      "experiments/animal-kingdom",
      provider
    );
  }

  async register(domain: string, params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "register", args: [`"${domain}"`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async getTokens(): Promise<String> {
    const query = this.createQuery({
      method: { name: "get-tokens", args: [] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrap(res);
  }
}
