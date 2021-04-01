import { contractAddress, deployContract, mocknet } from "./deploy";

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
  return deployContract(contractName, { path: "tokens" });
}

async function deployRockets() {
  const tokenName = "rocket-token"
  const marketName = "rocket-market-v3"
  const factoryName = "rocket-factory-v5"
  await await deployContract(tokenName, {
    path: "rockets",
    name: "rocket-token",
    replace: (s) =>
      s
        .replace(
          /ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW/g,
          mocknet
            ? contractAddress
            : "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW"
        )
        .replace(/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/g, contractAddress)
        .replace(/S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE/g, contractAddress),
  });
  await deployContract(marketName, {
    path: "rockets",
    name: "rocket-market",
    replace: (s) =>
      s.replace(
        /ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW/g,
        mocknet ? contractAddress : "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW"
      ),
  });
  await deployContract(factoryName, {
    path: "rockets",
    name: "rocket-factory",
    replace: (s) =>
      s
        .replace(/SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB/g, contractAddress)
        .replace(/SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR/g, contractAddress)
        .replace(/rocket-market/g, marketName)
  });
}
async function deploySips() {
  await deployContract("nft-trait", { path: "sips" });
  await deployContract("sip-10-ft-standard", {
    path: "sips",
    name: "ft-trait",
  });
}

(async () => {
  if (mocknet) {
    await deploySips();
  }
  await deployFlipCoin();
  await deployFlipCoinTaxOffice();
  await deployFlipCoinJackpot();
  await deployFlipCoinAtTwo();
  await deployHodlToken();
  await deployRockets();
})();
