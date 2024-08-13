pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITokenERC20 is IERC20 {
    function mint(address to, uint256 amount) external;
    function decimals() external view returns (uint8);
}

contract MyContract is ERC721 {

    ITokenERC20 public tokenErc20; 
    uint private tokenIdCounter;

    mapping (address => uint) deposit;

    constructor(address _tokenErc20) ERC721("MyNFT", "MNFT") {
        tokenErc20 = ITokenERC20(_tokenErc20);
    }

    function depositToken(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenErc20.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        deposit[msg.sender] += amount;

        if (deposit[msg.sender] >= 10000 * 10 ** tokenErc20.decimals()) {
            _mintNFT(msg.sender);
        }
    }

    function _mintNFT(address to) internal {
        tokenIdCounter += 1;
        _safeMint(to, tokenIdCounter);
    }

    function depositOf(address account) external view returns (uint256) {
        return deposit[account];
    }
}
