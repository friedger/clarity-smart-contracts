import { Client, Provider, Receipt, Result } from "@blockstack/clarity";

export class LicenseClient extends Client {
  constructor(provider: Provider) {
    super(
      "ST398K1WZTBVY6FE2YEHM6HP20VSNVSSPJTW0D53M.license",
      "license/license",
      provider
    );
  }

  async stxGetBalance(principal: string): Promise<number> {
    const query = this.createQuery({
      method: { name: "stx-get-balance", args: [`'${principal}`] },
    });
    try {
      const res = await this.submitQuery(query);
    } catch (e) {}
    return 100;
  }

  async stxTransfer(
    recipient: string,
    amount: number,
    params: { sender: string }
  ) {
    const tx = this.createTransaction({
      method: { name: "stx-transfer", args: [`'${recipient}`, `${amount}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async buyNonExpiring(params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "buy-non-expiring", args: [] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async buyExpiring(
    duration: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "buy-expiring", args: [`${duration}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async getPrice(type: number): Promise<number> {
    const query = this.createQuery({
      method: { name: "get-price", args: [`${type}`] },
    });
    const res = await this.submitQuery(query);
    const someString = Result.unwrap(res);
    return parseInt(someString.substr(6, someString.length - 7));
  }

  async getBlockHeight(): Promise<number> {
    const query = this.createQuery({
      method: { name: "get-block-height", args: [] },
    });
    const res = await this.submitQuery(query);
    return parseInt(Result.unwrap(res));
  }

  async getLicense(licensee: string): Promise<string> {
    const query = this.createQuery({
      method: { name: "get-license", args: [`'${licensee}`] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrap(res);
  }

  async hasValidLicense(licensee: string): Promise<boolean> {
    const query = this.createQuery({
      method: { name: "has-valid-license", args: [`'${licensee}`] },
    });
    const res = await this.submitQuery(query);
    if (res.success) {
      return Result.unwrap(res) === "true";
    } else {
      return false;
    }
  }

  async mineBlock(): Promise<number> {
    return this.getPrice(1);
  }
}
