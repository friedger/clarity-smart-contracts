import {
  Client,
  Provider,
  ProviderRegistry,
  Receipt,
} from "@blockstack/clarity";
import { expect } from "chai";
import { RocketFactoryClient } from "../../src/client/rockets/rocketFactory";
import { RocketMarketClient } from "../../src/client/rockets/rocketMarket";
import { RocketTokenClient } from "../../src/client/rockets/rocketToken";

describe("RocketFactoryClient Test Suite", () => {
  let rocketFactoryClient: RocketFactoryClient;
  let rocketTokenClient: RocketTokenClient;
  let rocketMarketClient: RocketMarketClient;
  let provider: Provider;

  const addresses = [
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
    "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
  ];
  const alice = addresses[0];
  const bob = addresses[1];
  const factory = addresses[2];

  const deployContracts = async () => {
    await new Client(
      "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.nft-trait",
      "sips/nft-trait",
      provider
    ).deployContract();
    await new Client(
      "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.sip-10-ft-standard",
      "sips/ft-trait",
      provider
    ).deployContract();
    console.log(await rocketTokenClient.deployContract());
    console.log(await rocketMarketClient.deployContract());
    console.log(await rocketFactoryClient.deployContract());
  };

  before(async () => {
    provider = await ProviderRegistry.createProvider();

    rocketFactoryClient = new RocketFactoryClient(provider);
    rocketTokenClient = new RocketTokenClient(provider);
    rocketMarketClient = new RocketMarketClient(provider);

    await deployContracts();
  });

  it("should have a valid syntax", async () => {
    await expect(rocketFactoryClient.checkContract()).to.not.throw;
    await expect(rocketTokenClient.checkContract()).to.not.throw;
    await expect(rocketMarketClient.checkContract()).to.not.throw;
  });

  describe("Deploying an instance of the contract", () => {
    it("should initialize Alice's state so that she can buy a new rocket", async () => {
      const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
      expect(canAliceBuy).to.be.true;
    });

    it("should initialize Bob's state so that he can buy a new rocket", async () => {
      const canBobBuy = await rocketFactoryClient.canUserBuy(bob);
      expect(canBobBuy).to.be.true;
    });

    it("should initialize Alice's number of rockets to 0", async () => {
      const aliceBalance = await rocketMarketClient.getBalance(alice);
      expect(aliceBalance).to.be.equal(0);
    });

    it("should initialize Bob's number of rockets to 0", async () => {
      const bobBalance = await rocketMarketClient.getBalance(bob);
      expect(bobBalance).to.be.equal(0);
    });

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
  });

  describe("Alice buying a rocket of size 1", () => {
    let receipt: Receipt;

    before(async () => {
      receipt = await rocketFactoryClient.orderRocket(1, { sender: alice });
    });

    it("should return an invalid receipt", async () => {
      expect(receipt.success).to.be.false;
    });

    it("should not make Alice unable to buy a new rocket", async () => {
      const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
      expect(canAliceBuy).to.be.true;
    });

    it("should not decrease Alice's balance (20 RKT remaining)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(20);
    });
  });

  describe("Alice buying a rocket of size 21", () => {
    let receipt: Receipt;

    before(async () => {
      receipt = await rocketFactoryClient.orderRocket(21, { sender: alice });
    });

    it("should return an invalid receipt", async () => {
      expect(receipt.success).to.be.false;
    });

    it("should not make Alice unable to buy a new rocket", async () => {
      const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
      expect(canAliceBuy).to.be.true;
    });

    it("should not decrease Alice's balance (20 RKT remaining)", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(20);
    });
  });

  describe("Alice buying a rocket of size 2", () => {
    describe("first order", () => {
      before(async () => {
        const res = await rocketFactoryClient.orderRocket(2, { sender: alice });
      });

      it("should make Alice unable to buy a new rocket", async () => {
        const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
        expect(canAliceBuy).to.be.false;
      });

      it("should decrease Alice's balance to 19 RKT", async () => {
        const balanceAlice = await rocketTokenClient.getBalance(alice);
        expect(balanceAlice).to.be.equal(19);
      });

      it("should not produce a claimable rocket", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserBuy(alice);
        expect(isRocketClaimable).to.be.false;
      });

      it("should not impact Bob's ability to buy a new rocket", async () => {
        const canBobBuy = await rocketFactoryClient.canUserBuy(bob);
        expect(canBobBuy).to.be.true;
      });

      it("should not impact Bob's balance (10 RKT)", async () => {
        const balanceBob = await rocketTokenClient.getBalance(bob);
        expect(balanceBob).to.be.equal(10);
      });
    });

    describe("1 block after the transaction, Alice's rocket", () => {
      it("should not be claimable", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserClaim(alice);
        expect(isRocketClaimable).to.be.false;
      });
    });

    describe("2 blocks after the transaction, Alice's rocket", () => {
      before(async () => {
        await rocketFactoryClient.mineBlock(alice);
      });

      it("should be claimable", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserClaim(alice);
        expect(isRocketClaimable).to.be.true;
      });

      describe("Alice claiming her rocket", () => {
        let receipt: Receipt;

        before(async () => {
          receipt = await rocketFactoryClient.claimRocket({ sender: alice });
        });

        it("should return a valid receipt", async () => {
          expect(receipt.success).to.be.true;
        });

        it("should make Alice able to buy a new rocket", async () => {
          const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
          expect(canAliceBuy).to.be.true;
        });

        it("should decrease Alice's balance of 1 RKT (18 RKT remaining)", async () => {
          const balanceAlice = await rocketTokenClient.getBalance(alice);
          expect(balanceAlice).to.be.equal(18);
        });

        it("should update Alice's number of rockets to 1", async () => {
          const aliceBalance = await rocketMarketClient.getBalance(alice);
          expect(aliceBalance).to.be.equal(1);
        });
      });
    });
  });

  describe("Alice buying a rocket of size 11", () => {
    before(async () => {
      await rocketFactoryClient.orderRocket(11, { sender: alice });
    });

    it("should make Alice unable to buy a new rocket", async () => {
      const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
      expect(canAliceBuy).to.be.false;
    });

    it("should decrease Alice's balance to 13 RKT", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(13);
    });

    it("should not produce a claimable rocket", async () => {
      const isRocketClaimable = await rocketFactoryClient.canUserBuy(alice);
      expect(isRocketClaimable).to.be.false;
    });

    it("should not impact Bob's ability to buy a new rocket", async () => {
      const canBobBuy = await rocketFactoryClient.canUserBuy(bob);
      expect(canBobBuy).to.be.true;
    });

    it("should not impact Bob's balance (10 RKT)", async () => {
      const balanceBob = await rocketTokenClient.getBalance(bob);
      expect(balanceBob).to.be.equal(10);
    });

    describe("1 block after the transaction, Alice's rocket", () => {
      it("should not be claimable", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserClaim(alice);
        expect(isRocketClaimable).to.be.false;
      });
    });

    describe("5 blocks after the transaction, Alice's rocket", () => {
      before(async () => {
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
      });

      it("should not be claimable", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserClaim(alice);
        expect(isRocketClaimable).to.be.false;
      });
    });

    describe("11 blocks after the transaction, Alice's rocket", () => {
      before(async () => {
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
        await rocketFactoryClient.mineBlock(alice);
      });

      it("should be claimable", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserClaim(alice);
        expect(isRocketClaimable).to.be.true;
      });

      describe("Alice claiming her rocket", () => {
        before(async () => {
          await rocketFactoryClient.claimRocket({ sender: alice });
        });

        it("should make Alice able to buy a new rocket", async () => {
          const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
          expect(canAliceBuy).to.be.true;
        });

        it("should decrease Alice's balance of 6 RKT (7 RKT remaining)", async () => {
          const balanceAlice = await rocketTokenClient.getBalance(alice);
          expect(balanceAlice).to.be.equal(7);
        });

        it("should update Alice's number of rockets to 1", async () => {
          const aliceBalance = await rocketMarketClient.getBalance(alice);
          expect(aliceBalance).to.be.equal(2);
        });
      });
    });
  });

  describe("Alice buying a rocket of size 14", () => {
    before(async () => {
      await rocketFactoryClient.orderRocket(14, { sender: alice });
    });

    it("should make Alice unable to buy a new rocket", async () => {
      const canAliceBuy = await rocketFactoryClient.canUserBuy(alice);
      expect(canAliceBuy).to.be.false;
    });

    it("should decrease Alice's balance to 0 RKT", async () => {
      const balanceAlice = await rocketTokenClient.getBalance(alice);
      expect(balanceAlice).to.be.equal(0);
    });

    it("should not produce a claimable rocket", async () => {
      const isRocketClaimable = await rocketFactoryClient.canUserBuy(alice);
      expect(isRocketClaimable).to.be.false;
    });

    describe("14 blocks after the transaction, Alice's rocket", () => {
      before(async () => {
        for (let i = 0; i < 13; i++) {
          await rocketFactoryClient.mineBlock(alice);
        }
      });

      it("should be claimable", async () => {
        const isRocketClaimable = await rocketFactoryClient.canUserClaim(alice);
        expect(isRocketClaimable).to.be.true;
      });

      describe("Alice claiming her rocket (with a RKT balance of 0)", () => {
        let receipt: Receipt;

        before(async () => {
          receipt = await rocketFactoryClient.claimRocket({ sender: alice });

          const balanceAlice = await rocketTokenClient.getBalance(alice);
          expect(balanceAlice).to.be.equal(0);
        });

        it("should return an invalid receipt", async () => {
          expect(receipt.success).to.be.false;
        });
      });
    });
  });

  after(async () => {
    await provider.close();
  });
});
