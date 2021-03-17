import { deployContract } from "./deploy";

async function deployFriedgerPoolNft() {
  var contractName = "friedger-pool-nft";
  return deployContract(contractName, "tokens");
}

(async () => {
  await deployFriedgerPoolNft();
})();
