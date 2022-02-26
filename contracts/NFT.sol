// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./WhitelistAdminRole.sol";
import "./Ownable.sol";
import "./WhitelistAdminRole.sol";
import "./Base64.sol";


contract NFT is ERC721Enumerable, Ownable, WhitelistAdminRole {
    using Strings for uint256;

    mapping(uint256 => string) _tokenURIs;
    mapping(uint256 => string) _names;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}


    function mint(address to, string memory _name, string memory _tokenURI) public onlyWhitelistAdmin {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(to, tokenId);
        _setName(tokenId, _name);
        _setTokenURI(tokenId, _tokenURI);
    }

    function addWhitelistAdmin(address account) public onlyOwner {
        _addWhitelistAdmin(account);
    }

    function removeWhitelistAdmin(address account) public onlyOwner {
        _removeWhitelistAdmin(account);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory output = string(
            abi.encodePacked("ipfs://", _tokenURIs[tokenId])
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        _names[tokenId],
                        '", "description": "To be filled.", "image": "',
                        output,
                        '"}'
                    )
                )
            )
        );

        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _setName(uint256 tokenId, string memory _name) internal virtual {
        _names[tokenId] = _name;
    }
}
