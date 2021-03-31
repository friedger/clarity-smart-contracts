import { Client, Provider, ProviderRegistry, Receipt } from "@blockstack/clarity";
import { expect } from "chai";
import { RocketTokenClient } from "../../src/client/rockets/rocketToken";

describe("RocketTokenClient Test Suite", () => {
  let rocketTokenClient: RocketTokenClient;
  let provider: Provider;

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
    "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
  ];
  const alice = addresses[0];
  const bob = addresses[1];
  const zoe = addresses[2];

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    console.log(await new Client(
      "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.sip-10-ft-standard",
      "sips/ft-trait",
      provider
    ).deployContract());

    rocketTokenClient = new RocketTokenClient(provider);
    await rocketTokenClient.deployContract();
  });

  it("should have a valid syntax", async () => {
    await rocketTokenClient.checkContract();
  });

  describe("Deploying an instance of the contract", () => {
    it("should initialize Alice's balance (20 RKT)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(20);
    });

    it("should initialize Bob's balance (10 RKT)", async () => {
      const balanceBob = await rocketTokenClient.getBalance(bob);
      expect(balanceBob).to.be.equal(10);
    });

    it("should initialize the total supply of RKT to 30", async () => {
      const totalSupply = await rocketTokenClient.totalSupply();
      expect(totalSupply).to.be.equal(30);
    });

    it("should initialize Zoe's balance (0 RKT)", async () => {
      const balanceZoe = await rocketTokenClient.getBalance(zoe);
      expect(balanceZoe).to.be.equal(0);
    });
  });

  describe("Alice transfering 5 RKT to Bob", () => {
    let receipt;
    before(async () => {
      receipt = await rocketTokenClient.transfer(bob, 5, { sender: alice });
    });

    it("should return an valid receipt", async () => {
      expect(receipt.success).to.be.true;
    });

    it("should decrease Alice's balance (15 RKT)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(15);
    });

    it("should increase Bob's balance (15 RKT)", async () => {
      const balanceBob = await rocketTokenClient.getBalance(bob);
      expect(balanceBob).to.be.equal(15);
    });
  });

  describe("Alice transfering -5 RKT to Bob", () => {
    let receipt: Receipt;

    before(async () => {
      receipt = await rocketTokenClient.transfer(bob, 16, { sender: alice });
    });

    it("should return an invalid receipt", async () => {
      expect(receipt.success).to.be.false;
    });

    it("should not increase Alice's balance (15 RKT)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(15);
    });

    it("should not decrease Bob's balance (15 RKT)", async () => {
      const balanceBob = await rocketTokenClient.getBalance(bob);
      expect(balanceBob).to.be.equal(15);
    });
  });

  describe("Alice transfering 5 RKT to herself", () => {
    let receipt: Receipt;

    before(async () => {
      receipt = await rocketTokenClient.transfer(alice, 5, { sender: alice });
    });

    it("should return an invalid receipt", async () => {
      expect(receipt.success).to.be.false;
    });

    it("should not increase Alice's balance (15 RKT)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(15);
    });

    it("should not decrease Bob's balance (15 RKT)", async () => {
      const balanceBob = await rocketTokenClient.getBalance(bob);
      expect(balanceBob).to.be.equal(15);
    });
  });

  describe("Bob transfering 16 RKT to Alice", () => {
    let receipt: Receipt;

    before(async () => {
      receipt = await rocketTokenClient.transfer(bob, 16, { sender: alice });
    });

    it("should return an invalid receipt", async () => {
      expect(receipt.success).to.be.false;
    });

    it("should not increase Alice's balance (15 RKT)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(15);
    });

    it("should not decrease Bob's balance (15 RKT)", async () => {
      const balanceBob = await rocketTokenClient.getBalance(bob);
      expect(balanceBob).to.be.equal(15);
    });
  });

  after(async () => {
    await provider.close();
  });
});
