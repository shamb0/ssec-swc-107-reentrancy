pragma solidity ^0.5.0;

import "@nomiclabs/buidler/console.sol";

contract EtherStore {
    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;


    function debugPrintBalance() public payable {
        console.log("Info@EtherStore.sol::debugPrintBalance ContBal(%s)", address(this).balance );
    }

    function depositFunds() public payable {

        console.log("Info@EtherStore.sol::depositFunds Entry ContBal(%s)", address(this).balance );
        console.log("Info@EtherStore.sol::depositFunds Sender(%s)", msg.sender );
        console.log("Info@EtherStore.sol::depositFunds Val(%s)", msg.value );

        balances[msg.sender] += msg.value;

        console.log("Info@EtherStore.sol::depositFunds Exit ContBal(%s)", address(this).balance );

    }

    function withdrawFunds(uint256 _weiToWithdraw) public {

        console.log("Info@EtherStore.sol::withdrawFunds Entry ContBal(%s)", address(this).balance );
        console.log("Info@EtherStore.sol::withdrawFunds Sender(%s)", msg.sender );
        console.log("Info@EtherStore.sol::withdrawFunds _weiToWithdraw(%s)", _weiToWithdraw );

        require(balances[msg.sender] >= _weiToWithdraw, "Err Not Enough Fund In Balance");

        // limit the withdrawal
        require(_weiToWithdraw <= withdrawalLimit, "Err Exceeds Max Withdraw Limit" );

        // limit the time allowed to withdraw
        require(now >= lastWithdrawTime[msg.sender] + 1 weeks, "Err Exceeds Max Withdraw Time Limit" );

        // require(msg.sender.call.value(_weiToWithdraw)());

        (bool success, ) = msg.sender.call.value(_weiToWithdraw)("");

        require( success, "Err Eth Transfer failed" );

        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = now;

        console.log("Info@EtherStore.sol::withdrawFunds Exit ContBal(%s)", address(this).balance );
    }

    function() external payable {

        require(msg.data.length == 0);

        console.log("Info@EtherStore.sol::fallback ContBal(%s)", address(this).balance );
    }

    function withdrawEth() public {
        msg.sender.transfer( address(this).balance );
    }

}
