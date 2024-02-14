// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract SavingContract {

    mapping (address => uint) public savings;

   event SavingSuccessful(address indexed user, uint256 indexed amount);

    function deposit() external payable{
                require(msg.sender != address(0), "no zero address call");

        require(msg.value > 0, "can't save zero value");
        savings[msg.sender] += msg.value;

        emit SavingSuccessful(msg.sender, msg.value);
        
    }
  
  function withdraw() external {
        require(msg.sender != address(0), "no zero address call");

    uint256 _userBalance = savings[msg.sender];

    require(_userBalance > 0, "you don't have any savings");
     uint256 _totalBalance  = savings[msg.sender];
     savings[msg.sender] -= _totalBalance;
     payable(msg.sender).transfer(_totalBalance);

  }

  function checkSavings(address _address) external view returns (uint) {
    return savings[_address];
  }

  function sendOutSaving(address _address, uint _amount ) external {
        require(msg.sender != address(0), "no zero address call");

    require(_amount > 0, "can't send zero value");
    savings[msg.sender] -= _amount;
    payable(_address).transfer(_amount);
  }


}