pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    modifier onlyCaller(address owner) {
        require(msg.sender == owner, "Address invalid");
        _;
    }

    function mint(address to, uint256 amount) public onlyCaller(to) {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}