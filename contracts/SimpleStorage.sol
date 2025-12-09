// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleStorage - store and retrieve a single unsigned integer
contract SimpleStorage {
    uint256 private storedValue;

    event ValueUpdated(uint256 newValue, address indexed updater);

    function set(uint256 newValue) external {
        storedValue = newValue;
        emit ValueUpdated(newValue, msg.sender);
    }

    function get() external view returns (uint256) {
        return storedValue;
    }
}
