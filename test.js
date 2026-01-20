const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  it("Should dispense tokens and enforce cooldown", async function () {
    const [owner, user] = await ethers.getSigners();
    
    // Deploy Token & Faucet
    const Token = await ethers.getContractFactory("FaucetToken");
    const token = await Token.deploy(1000);
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy(token.address);
    
    // Fund Faucet
    await token.transfer(faucet.address, ethers.utils.parseUnits("500", 18));

    // Request 1
    await faucet.connect(user).requestTokens();
    expect(await token.balanceOf(user.address)).to.equal(ethers.utils.parseUnits("100", 18));

    // Request 2 (Should Fail due to cooldown)
    await expect(
        faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Cooldown active: Please wait 24h");
  });
});
