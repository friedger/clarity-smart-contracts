import { Client, Provider, Receipt, Result } from "@blockstack/clarity";

export class HodlTokenClient extends Client {
    constructor(address: string, provider: Provider) {
        super(
            `${address}.hodl-token`,
            "tokens/hodl-token",
            provider
        );
    }

    async hodl(amount: number, params: { sender: string }) {
        const tx = await this.createTransaction({
            method: { name: "hodl", args: [`u${amount}`] }
        })
        await tx.sign(params.sender)
        const receipt = this.submitTransaction(tx)
    }

    async transfer(
        to: string,
        value: number,
        params: { sender: string }
    ): Promise<Receipt> {
        const tx = this.createTransaction({
            method: { name: "transfer-token", args: [`'${to}`, `${value}`] },
        });
        await tx.sign(params.sender);
        const res = await this.submitTransaction(tx);
        return res;
    }

    async balanceOf(owner: string): Promise<number> {
        const query = this.createQuery({
            method: { name: "balance-of", args: [`'${owner}`] },
        });
        const res = await this.submitQuery(query);
        return parseInt(Result.unwrap(res).substr(1));
    }

    async hodlBalanceOf(owner: string): Promise<number> {
        const query = this.createQuery({
            method: { name: "hodl-balance-of", args: [`'${owner}`] },
        });
        const res = await this.submitQuery(query);
        console.log(res)
        return parseInt(Result.unwrap(res).substr(1));
    }

    async getHoldInBank(): Promise<number> {
        const query = this.createQuery({
            method: { name: "get-hodl-in-bank", args: [] },
        });
        const res = await this.submitQuery(query);
        console.log(res)
        return parseInt(Result.unwrap(res).substr(1));
    }

    async getSpendableInBank(): Promise<number> {
        const query = this.createQuery({
            method: { name: "get-spendable-in-bank", args: [] },
        });
        const res = await this.submitQuery(query);
        console.log(res)
        return parseInt(Result.unwrap(res).substr(1));
    }


    async approve(
        spender: string,
        amount: number,
        params: { sender: string }
    ): Promise<Receipt> {
        const tx = this.createTransaction({
            method: { name: "approve", args: [`'${spender}`, `${amount}`] },
        });
        await tx.sign(params.sender);
        const res = await this.submitTransaction(tx);
        return res;
    }

    async revoke(spender: string, params: { sender: string }): Promise<Receipt> {
        const tx = this.createTransaction({
            method: { name: "revoke", args: [`'${spender}`] },
        });
        await tx.sign(params.sender);
        const res = await this.submitTransaction(tx);
        return res;
    }

    async allowanceOf(spender: string, owner: string): Promise<number> {
        const query = this.createQuery({
            method: { name: "allowance-of", args: [`'${spender}`, `'${owner}`] },
        });
        const res = await this.submitQuery(query);
        return parseInt(Result.unwrap(res));
    }

    async transferFrom(
        from: string,
        to: string,
        value: number,
        params: { sender: string }
    ): Promise<Receipt> {
        const tx = this.createTransaction({
            method: {
                name: "transfer-from",
                args: [`'${from}`, `'${to}`, `${value}`],
            },
        });
        await tx.sign(params.sender);
        const res = await this.submitTransaction(tx);
        return res;
    }
}
