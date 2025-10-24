// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OGPayment {
    event Deposit(address indexed buyer, address indexed creator, uint256 amount);

    function deposit(address creator) external payable {
        require(msg.value > 0, "No payment sent");
        require(creator != address(0), "Invalid creator");

        payable(creator).transfer(msg.value);
        emit Deposit(msg.sender, creator, msg.value);
    }
}
