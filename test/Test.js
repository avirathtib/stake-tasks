const { expect } = require("chai");
const { assert } = require("chai");

describe("Stake contract", function () {
  it("Deployment should commit a new stake", async function () {
    const [owner, address1, address2] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");

    const hardhatToken = await Stake.deploy();

    const stakeOne = await hardhatToken.commitStake(
      "Luke Skywalker",
      "Protect the force",
      address2.address,
      { value: ethers.utils.parseEther("0.5") }
    );

    const allStakes = await hardhatToken.getAllStakes();

    assert.equal(1, allStakes.length);
    assert.equal(allStakes[0].stakeeName, "Luke Skywalker");
    assert.equal(allStakes[0].stakeTask, "Protect the force");
    assert.equal(allStakes[0].status, 3);
  });

  it("Deployment should change the status of a transaction from Unconfirmed to Pending", async function () {
    const [owner, address1, address2] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");

    const hardhatToken = await Stake.deploy();

    const stakeOne = await hardhatToken.commitStake(
      "Luke Skywalker",
      "Protect the force",
      address2.address,
      { value: ethers.utils.parseEther("0.5") }
    );

    await hardhatToken.connect(address2).validatorConfirmation(0);

    const allStakes = await hardhatToken.getAllStakes();

    assert.equal(allStakes[0].status, 2);
  });

  it("Deployment should change the status of a transaction from Unconfirmed to Pending", async function () {
    const [owner, address1, address2] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");

    const hardhatToken = await Stake.deploy();

    const stakeOne = await hardhatToken
      .connect(address1)
      .commitStake("Luke Skywalker", "Protect the force", address2.address, {
        value: ethers.utils.parseEther("0.5"),
      });

    const stakeTwo = await hardhatToken
      .connect(address1)
      .commitStake("Darth Vader", "Be a good dad to Luke", address2.address, {
        value: ethers.utils.parseEther("1"),
      });

    const stakeeTransactionArray = await hardhatToken
      .connect(address1)
      .getStakeeTransactionArray();

    const allStakes = await hardhatToken.getAllStakes();
    assert.equal(stakeeTransactionArray[0].stakeeName, "Luke Skywalker");
    assert.equal(stakeeTransactionArray[0].stakeTask, "Protect the force");
    assert.equal(stakeeTransactionArray[1].stakeeName, "Darth Vader");
    assert.equal(stakeeTransactionArray[1].stakeTask, "Be a good dad to Luke");
  });
});
