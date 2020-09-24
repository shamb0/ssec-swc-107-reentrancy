pragma solidity ^0.5.0;

import "@nomiclabs/buidler/console.sol";

contract EtherStoreFixed {

    // initialise the mutex
    bool reEntrancyMutex = false;

    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;


    function debugPrintBalance() public payable {
        console.log("Info@EtherStoreFixed.sol::debugPrintBalance ContBal(%s)", address(this).balance );
    }

    function depositFunds() public payable {

        console.log("Info@EtherStoreFixed.sol::depositFunds Entry ContBal(%s)", address(this).balance );
        console.log("Info@EtherStoreFixed.sol::depositFunds Sender(%s)", msg.sender );
        console.log("Info@EtherStoreFixed.sol::depositFunds Val(%s)", msg.value );

        balances[msg.sender] += msg.value;

        console.log("Info@EtherStoreFixed.sol::depositFunds Exit ContBal(%s)", address(this).balance );

    }

    function withdrawFunds(uint256 _weiToWithdraw) public {

        console.log("Info@EtherStoreFixed.sol::withdrawFunds Entry ContBal(%s)", address(this).balance );
        console.log("Info@EtherStoreFixed.sol::withdrawFunds Sender(%s)", msg.sender );
        console.log("Info@EtherStoreFixed.sol::withdrawFunds _weiToWithdraw(%s)", _weiToWithdraw );

        require( !reEntrancyMutex );

        require(balances[msg.sender] >= _weiToWithdraw, "Err Not Enough Fund In Balance");

        // limit the withdrawal
        require(_weiToWithdraw <= withdrawalLimit, "Err Exceeds Max Withdraw Limit" );

        // limit the time allowed to withdraw
        require(now >= lastWithdrawTime[msg.sender] + 1 weeks, "Err Exceeds Max Withdraw Time Limit" );


        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = now;

        // set the reEntrancy mutex before the external call
        reEntrancyMutex = true;

        // require(msg.sender.call.value(_weiToWithdraw)());
        (bool success, ) = msg.sender.call.value(_weiToWithdraw)("");

        require( success, "Err Eth Transfer failed" );

        // reset the reEntrancy mutex before the external call
        reEntrancyMutex = false;

        console.log("Info@EtherStoreFixed.sol::withdrawFunds Exit ContBal(%s)", address(this).balance );
    }

    function() external payable {

        require(msg.data.length == 0);

        console.log("Info@EtherStoreFixed.sol::fallback ContBal(%s)", address(this).balance );
    }

    function withdrawEth() public {
        msg.sender.transfer( address(this).balance );
    }

}
