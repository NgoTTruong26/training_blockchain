// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract LogicContract is
    Initializable,
    AccessControlUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Info {
        address user;
        uint256 amount;
        uint256 time;
    }

    mapping(address => uint256) public ordinal;
    mapping(uint256 => Info) public info;

    address public acceptedCurrency;

    function __LogicContract_init(
        address _acceptedCurrency
    ) public initializer {
        __Ownable_init();
        acceptedCurrency = _acceptedCurrency;
    }

    function placeBid(uint256 _amount) public payable nonReentrant {
        transferFund(_amount, acceptedCurrency, msg.sender, address(this));
    }

    function getInfo(address _user) public view returns (Info memory) {
        return info[ordinal[_user]];
    }

    function getInfoByOrdinal(
        uint256 _from,
        uint256 _to
    ) public view returns (Info[] memory) {
        Info[] memory bids = new Info[](_to - _from);
        for (uint256 i = 0; i < _to - _from; i++) {
            bids[i] = info[_from + i];
        }
        return bids;
    }

    function setFeeAddress(address _currency) public onlyOwner {
        acceptedCurrency = _currency;
    }

    function transferFund(
        uint256 _amount,
        address _token,
        address _from,
        address _to
    ) internal {
        if (_from == address(this)) {
            IERC20(_token).transfer(_to, _amount);
        } else {
            IERC20(_token).transferFrom(_from, _to, _amount);
        }
    }
}
