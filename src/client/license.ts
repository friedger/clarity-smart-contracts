import { Client, Provider, Receipt, Result } from "@blockstack/clarity";

export class LicenseClient extends Client {
  constructor(provider: Provider) {
    super("license", "license/license", provider);
  }

  async buy(type:number, params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "buy", args: [`${type}`] }
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async getPrice(type: number): Promise<number> {
    const query = this.createQuery({ method: { name: "get-price", args: [`${type}`] } });
    const res = await this.submitQuery(query);
    console.log(res)
    return parseInt(Result.unwrap(res));
  }
}
