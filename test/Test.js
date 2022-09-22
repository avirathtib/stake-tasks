const { expect } = require("chai");
const { assert } = require("chai");
describe("Stake contract", function () {
  it("Deployment should commit a new stake", async function () {
    const [owner, address1, address2] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");

    const hardhatToken = await Stake.deploy();

    const stakeOne = await hardhatToken.commitStake(
      "Avirath",
      "Play the saxophone for 20 minutes",
      address2.address,
      { value: ethers.utils.parseEther("0.5") }
    );

    const allStakes = await hardhatToken.getAllStakes();
    console.log(allStakes[0].stakeeName);

    assert.equal(1, allStakes.length);
  });
});
