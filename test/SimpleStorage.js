const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  it("stores and retrieves values", async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();

    const [owner, other] = await ethers.getSigners();

    expect(await simpleStorage.get()).to.equal(0);

    await expect(simpleStorage.set(123))
      .to.emit(simpleStorage, "ValueUpdated")
      .withArgs(123, owner.address);

    expect(await simpleStorage.get()).to.equal(123);

    await simpleStorage.connect(other).set(456);
    expect(await simpleStorage.get()).to.equal(456);
  });
});
