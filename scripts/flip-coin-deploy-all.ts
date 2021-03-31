import { deployContract } from "./deploy";

async function deployFlipCoin() {
  var contractName = "flip-coin";
  return deployContract(contractName);
}

async function deployFlipCoinTaxOffice() {
  var contractName = "flip-coin-tax-office";
  return deployContract(contractName);
}

async function deployFlipCoinJackpot() {
  var contractName = "flip-coin-jackpot";
  return deployContract(contractName);
}

async function deployFlipCoinAtTwo() {
  var contractName = "flip-coin-at-two";
  return deployContract(contractName);
}

async function deployHodlToken() {
  var contractName = "hodl-token";
  return deployContract(contractName, "tokens");
}

async function deployRockets() {
  await deployContract("rocket-factory", "rockets");
  await deployContract("rocket-market", "rockets");
}
(async () => {
  await deployFlipCoin();
  await deployFlipCoinTaxOffice();
  await deployFlipCoinJackpot();
  await deployFlipCoinAtTwo();
  await deployHodlToken();
  await deployRockets();
})();
