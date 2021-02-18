import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
} from "@blockstack/clarity";
import { providerWithInitialAllocations } from "./providerWithInitialAllocations";
import {
  addressFromPublicKeys,
  AddressHashMode,
  addressToString,
  AddressVersion,
  createStacksPrivateKey,
  createStacksPublicKey,
  getPublicKey,
  publicKeyToAddress,
  StacksPublicKey,
} from "@stacks/transactions";
import { ADDR1, ADDR2, testnetKeyMap } from "../../scripts/mocknet";

class FlipCoinClassicProvider extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-at-two",
      "experiments/flip-coin-at-two.clar",
      provider
    );
  }

  async fundSlot(sender: string, receiver: string, amount: number) {
    const tx = this.createTransaction({
      method: {
        name: "fund-slot",
        args: [`u${amount}`, `'${receiver}`],
      },
    });
    await tx.sign(sender);
    await this.submitTransaction(tx);
  }

  async bet(trueBacker: StacksPublicKey, falseBacker: StacksPublicKey) {
    const trueBackerAddress = publicKeyToAddress(
      AddressVersion.TestnetSingleSig,
      trueBacker
    );
    const falseBackerAddress = publicKeyToAddress(
      AddressVersion.TestnetSingleSig,
      falseBacker
    );
    const multiSigAddress = addressFromPublicKeys(
      AddressVersion.TestnetMultiSig,
      AddressHashMode.SerializeP2SH,
      2,
      [trueBacker, falseBacker]
    );
    await this.fundSlot(
      trueBackerAddress,
      addressToString(multiSigAddress),
      1000
    );
    await this.fundSlot(
      falseBackerAddress,
      addressToString(multiSigAddress),
      1000
    );
    const tx = this.createTransaction({
      method: {
        name: "bet",
        args: [
          `(tuple (bet-true '${trueBackerAddress}) (bet-false '${falseBackerAddress}))`,
        ],
      },
    });
    tx.sign(addressToString(multiSigAddress));
    return this.submitTransaction(tx);
  }
}

describe("flip coin tax office contract test suite", () => {
  let provider: Provider;
  let client: FlipCoinClassicProvider;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinClassicProvider(provider);
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin",
        "experiments/flip-coin.clar",
        provider
      ).deployContract();
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-tax-office",
        "experiments/flip-coin-tax-office.clar",
        provider
      ).deployContract();
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-jackpot",
        "experiments/flip-coin-jackpot.clar",
        provider
      ).deployContract();
    });

    it("should have a valid syntax", async () => {
      await client.checkContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("basic tests", () => {
    before(async () => {
      ProviderRegistry.registerProvider(
        providerWithInitialAllocations([
          {
            principal: "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6",
            amount: 10000,
          },
          {
            principal: "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y",
            amount: 10000,
          },
        ])
      );
      provider = await ProviderRegistry.createProvider();
      client = new FlipCoinClassicProvider(provider);
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin",
        "experiments/flip-coin.clar",
        provider
      ).deployContract();
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-tax-office",
        "experiments/flip-coin-tax-office.clar",
        provider
      ).deployContract();
      await new Client(
        "S1G2081040G2081040G2081040G208105NK8PE5.flip-coin-jackpot",
        "experiments/flip-coin-jackpot.clar",
        provider
      ).deployContract();

      await client.deployContract();
    });

    it("should bet", async () => {
      const key1 = getPublicKey(
        createStacksPrivateKey(testnetKeyMap[ADDR1].secretKey)
      );
      const key2 = getPublicKey(
        createStacksPrivateKey(testnetKeyMap[ADDR2].secretKey)
      );
      console.log(await client.bet(key1, key2));
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
