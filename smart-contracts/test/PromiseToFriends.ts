import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PromiseToFriends", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    // Contracts are deployed using the first signer/account by default
    const [owner, friend, stranger] = await ethers.getSigners();

    const Promise = await ethers.getContractFactory("PromiseToFriends");
    const promise = await Promise.deploy();
    await promise.waitForDeployment();

    const ONE_WEEK_IN_SECONDS = 604800;
    const latestTime = await time.latest();
    const invalidExp = latestTime - ONE_WEEK_IN_SECONDS;
    const validExp = latestTime + ONE_WEEK_IN_SECONDS;
    const message = "Some message";
    let amount = ethers.parseUnits("0.5", "ether");

    return {
      promise,
      invalidExp,
      validExp,
      amount,
      message,
      owner,
      friend,
      stranger,
    };
  }

  const getBalance = async (address: any) =>
    await ethers.provider.getBalance(address);

  describe("Promise creation", function () {
    it("Should throw error when msg.value == 0", async function () {
      const { promise, invalidExp, message, friend } = await loadFixture(
        deployContractAndSetVariables
      );

      await expect(
        promise.createPromise(friend, message, invalidExp, {
          value: 0,
        })
      ).to.be.revertedWith("Cannot be an empty promise!");
    });

    it("Should throw error when using invalid expiration date", async function () {
      const { promise, invalidExp, amount, message, friend } =
        await loadFixture(deployContractAndSetVariables);

      await expect(
        promise.createPromise(friend, message, invalidExp, {
          value: amount,
        })
      ).to.be.revertedWith("Expiraton should be in the future.");
    });

    it("Should successfully create (multiple) promises", async function () {
      const { promise, validExp, amount, message, owner, friend } =
        await loadFixture(deployContractAndSetVariables);

      const firstPromise = await promise.createPromise(
        friend,
        message,
        validExp,
        {
          value: amount,
        }
      );
      const secondPromise = await promise
        .connect(friend)
        .createPromise(owner, message, validExp, {
          value: amount,
        });

      await expect(firstPromise)
        .to.emit(promise, "PromiseUpdate")
        .withArgs(
          friend.address,
          owner.address,
          0,
          1,
          amount,
          message,
          validExp
        );
      await expect(secondPromise)
        .to.emit(promise, "PromiseUpdate")
        .withArgs(
          owner.address,
          friend.address,
          0,
          2,
          amount,
          message,
          validExp
        );
      expect(await ethers.provider.getBalance(promise.target)).to.equal(
        amount + amount
      );
    });
  });

  describe("Promise verification", function () {
    it("Should throw error when using a non-existent id", async function () {
      const { promise } = await loadFixture(deployContractAndSetVariables);

      await expect(promise.verifyPromiseCompletion(1)).to.be.revertedWith(
        "Promise cannot be found."
      );
    });

    it("Should throw error when owner verifies its own promise", async function () {
      const errorMessage =
        "Promise can only be verified by the user who is given the promise.";
      const { promise, validExp, amount, message, friend, stranger } =
        await loadFixture(deployContractAndSetVariables);

      await promise.createPromise(friend, message, validExp, {
        value: amount,
      });

      await expect(promise.verifyPromiseCompletion(1)).to.be.revertedWith(
        errorMessage
      );
      await expect(
        promise.connect(stranger).verifyPromiseCompletion(1)
      ).to.be.revertedWith(errorMessage);
    });

    it("Should throw error when verifying an already settled promise", async function () {
      const { promise, validExp, amount, message, friend } = await loadFixture(
        deployContractAndSetVariables
      );

      await promise.createPromise(friend, message, validExp, {
        value: amount,
      });
      await promise.connect(friend).verifyPromiseCompletion(1);
      await expect(
        promise.connect(friend).verifyPromiseCompletion(1)
      ).to.be.revertedWith("Promise already settled.");
    });

    it("Should successfully transfer funds back to owner if owner kept its promise before the deadline; verified by other", async function () {
      const { promise, validExp, amount, message, owner, friend } =
        await loadFixture(deployContractAndSetVariables);

      await promise.createPromise(friend, message, validExp, {
        value: amount,
      });

      const beforeOwnerBalance = await getBalance(owner.address);
      const verifyPromise = await promise
        .connect(friend)
        .verifyPromiseCompletion(1);
      const afterOwnerBalance = await getBalance(owner.address);

      expect(afterOwnerBalance - beforeOwnerBalance).to.equal(amount);
      expect(await getBalance(promise.target)).to.equal(0);

      await expect(verifyPromise)
        .to.emit(promise, "PromiseUpdate")
        .withArgs(
          friend.address,
          owner.address,
          1,
          1,
          amount,
          message,
          validExp
        );
    });

    it("Should successfully transfer funds to other if owner failed to deliver its promise before the deadline", async function () {
      const { promise, validExp, amount, message, friend, owner } =
        await loadFixture(deployContractAndSetVariables);

      await promise.createPromise(friend, message, validExp, {
        value: amount,
      });
      await time.increaseTo(validExp + 6000);

      const beforeOtherBalance = await getBalance(friend.address);
      const failedPromise = await promise
        .connect(friend)
        .verifyPromiseCompletion(1);
      const afterOtherBalance = await getBalance(friend.address);

      expect(beforeOtherBalance).to.be.lessThan(afterOtherBalance); // TODO improve
      expect(await ethers.provider.getBalance(promise.target)).to.equal(0);

      await expect(failedPromise)
        .to.emit(promise, "PromiseUpdate")
        .withArgs(
          friend.address,
          owner.address,
          2,
          1,
          amount,
          message,
          validExp
        );
    });
  });
});
