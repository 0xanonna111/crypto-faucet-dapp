const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // 1. Deploy Token
  const Token = await hre.ethers.getContractFactory("FaucetToken");
  // 10 Million initial supply
  const token = await Token.deploy(10000000); 
  await token.deployed();
  console.log("Token deployed to:", token.address);

  // 2. Deploy Faucet
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(token.address);
  await faucet.deployed();
  console.log("Faucet deployed to:", faucet.address);

  // 3. Fund the Faucet (Send 1M tokens to the faucet contract)
  const fundAmount = hre.ethers.utils.parseUnits("1000000", 18);
  await token.transfer(faucet.address, fundAmount);
  console.log("Faucet funded with 1,000,000 TEST");

  console.log("--- CONFIG ---");
  console.log(`const TOKEN_ADDR = "${token.address}";`);
  console.log(`const FAUCET_ADDR = "${faucet.address}";`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
