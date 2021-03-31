import { Client, Provider, ProviderRegistry, Receipt } from "@blockstack/clarity";
import { expect } from "chai";
import { RocketFactoryClient } from "../../src/client/rockets/rocketFactory";
import { RocketMarketClient } from "../../src/client/rockets/rocketMarket";
import { RocketTokenClient } from "../../src/client/rockets/rocketToken";

describe("RocketMarketClient Test Suite", () => {
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
    await rocketTokenClient.deployContract();
    await rocketMarketClient.deployContract();
    await rocketFactoryClient.deployContract();
  };

  let res: Receipt;

  before(async () => {
    provider = await ProviderRegistry.createProvider();

    rocketFactoryClient = new RocketFactoryClient(provider);
    rocketTokenClient = new RocketTokenClient(provider);
    rocketMarketClient = new RocketMarketClient(provider);

    await deployContracts();
    res = await rocketFactoryClient.orderRocket(2, { sender: alice });
    expect(res.success, res.error).to.be.true;
    await rocketFactoryClient.mineBlock(alice);
    res = await rocketFactoryClient.claimRocket({ sender: alice });
    expect(res.success, res.error).to.be.true;
  });

  describe("Fly with pilot tests", () => {
    it("should fly", async () => {
      res = await rocketMarketClient.flyShip(2, { sender: alice });
      expect(res.success, res.error).to.be.true;
    });

    it("should authorize Bob ", async () => {
      res = await rocketMarketClient.authorizePilot(2, bob, { sender: alice });
      expect(res.success, res.error).to.be.true;
    });

    it("should allow Alice to fly", async () => {
      res = await rocketMarketClient.flyShip(2, { sender: alice });
      expect(res.success, res.error).to.be.true;
    });

    it("should allow Bob to fly ", async () => {
      res = await rocketMarketClient.flyShip(2, { sender: bob });
      expect(res.success, res.error).to.be.true;
    });
  });
});
