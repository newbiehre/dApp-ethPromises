// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract PromiseToFriends {
    using Counters for Counters.Counter;

    enum PromiseStatus {
        CREATED,
        COMPLETED,
        FAILED
    }

    event PromiseUpdate(
        address indexed to,
        address indexed from,
        PromiseStatus indexed status,
        uint256 promiseId,
        uint amount,
        string message,
        uint256 expireAt
    );

    struct Promise {
        uint256 id;
        address payable to;
        address payable from;
        uint amount;
        string message;
        uint256 expireAt;
        PromiseStatus status;
        bool isSettled;
    }

    Counters.Counter public promiseIdCounter;
    mapping(uint256 => Promise) public idToPromise;
    Promise[] allPromises;

    Counters.Counter public completionSize;
    Counters.Counter public failureSize;

    /**
     * @dev create a promise
     * actor: anyone
     */
    function createPromise(
        address _to,
        string memory _message,
        uint256 _expireAt
    ) public payable {
        require(_to != address(0), "Invalid address.");
        require(msg.value > 0, "Cannot be an empty promise!");
        require(
            block.timestamp < _expireAt,
            "Expiraton should be in the future."
        );

        promiseIdCounter.increment();
        uint256 newId = promiseIdCounter.current();
        Promise memory p = Promise(
            newId,
            payable(_to),
            payable(msg.sender),
            msg.value,
            _message,
            _expireAt,
            PromiseStatus.CREATED,
            false
        );

        idToPromise[newId] = p;
        allPromises.push(p);
        emit PromiseUpdate(
            p.to,
            p.from,
            PromiseStatus.CREATED,
            newId,
            p.amount,
            p.message,
            p.expireAt
        );
    }

    /**
     * @dev verify the completion (or failure) of a promise
     * actor: user who is given the promise.
     */
    function verifyPromiseCompletion(
        uint256 _id
    ) public payable returns (Promise memory) {
        Promise storage p = idToPromise[_id];

        require(p.id != 0, "Promise cannot be found.");
        require(
            p.to == msg.sender,
            "Promise can only be verified by the user who is given the promise."
        );
        require(!p.isSettled, "Promise already settled.");
        assert(address(this).balance >= p.amount);

        p.isSettled = true;

        bool isNotExpired = p.expireAt >= block.timestamp;
        if (isNotExpired) {
            completionSize.increment();
            p.from.transfer(p.amount);
        } else {
            failureSize.increment();
            p.to.transfer(p.amount);
        }

        emit PromiseUpdate(
            p.to,
            p.from,
            isNotExpired ? PromiseStatus.COMPLETED : PromiseStatus.FAILED,
            _id,
            p.amount,
            p.message,
            p.expireAt
        );
        return p;
    }

    /**
     * @dev fetch all promises
     */
    function getAllPromises() public view returns (Promise[] memory) {
        return allPromises;
    }

    /**
     * @dev fetch promise by id
     */
    function getPromiseById(uint256 _id) public view returns (Promise memory) {
        return idToPromise[_id];
    }
}
