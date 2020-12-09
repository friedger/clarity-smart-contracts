import { Client, Provider, Receipt, Result } from "@blockstack/clarity";

export class RocketMarketClient extends Client {
  constructor(provider: Provider) {
    super(
      "SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.rocket-market",
      "rockets/rocket-market",
      provider
    );
  }

  async getBalance(owner: string): Promise<number> {
    const query = this.createQuery({
      atChaintip: true,
      method: { name: "get-balance", args: [`'${owner}`] },
    });
    const res = await this.submitQuery(query); // returns Result of uint
    return parseInt(Result.unwrap(res).substr(1));
  }

  async getOwner(tokenId: number): Promise<string> {
    const query = this.createQuery({
      atChaintip: true,
      method: { name: "get-owner", args: [`${tokenId}`] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrap(res).replace(/'/g, "");
  }

  async transfer(
    to: string,
    tokenId: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "transfer", args: [`'${to}`, `${tokenId}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async flyShip(
    rocketId: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "fly-ship", args: [`u${rocketId}`] },
    });
    await tx.sign(params.sender);
    return await this.submitTransaction(tx);
  }

  async authorizePilot(
    rocketId: number,
    pilot: string,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "authorize-pilot", args: [`u${rocketId}`, `'${pilot}`] },
    });
    await tx.sign(params.sender);
    return await this.submitTransaction(tx);
  }
}
