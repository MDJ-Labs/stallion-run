// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract StallionNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Strings for uint256;
    uint256 private constant _TOTAL_MAX_SUPPLY = 9000;
    uint256 private constant _LEVEL_MAX_SUPPLY = 3000;
    uint256 private _counter;

    // Enums
    enum Level {
        Bullet,
        Riffle,
        Flash
    }

    struct Attributes {
        uint256 mintprice;
        uint256 supply;
    }

    mapping(uint256 => Attributes) private _levels;
    mapping(address => uint256) private horseLeveLOwned;

    constructor() ERC721("StallionRun", "SRN") {
        _levels[0] = Attributes(0.1 ether, 0);
        _levels[1] = Attributes(0.2 ether, 0);
        _levels[2] = Attributes(0.3 ether, 0);
    }

    /**
     * @notice Base URI for computing {tokenURI}
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return
            "https://ipfs.io/ipfs/bafybeieic5yzvavzl4udjzcg4tnun3bqwp4ec2lgd6dayfobm5otez3nmu/";
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @notice Destroys `tokenId`.
     * @param tokenId id of the token to destroy
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice returns url of the token
     * @param tokenId id of the token
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function mint(Level _level) public payable {
        require(balanceOf(msg.sender) < 1, "only 1 NFT per address");
        require(_counter < _TOTAL_MAX_SUPPLY, "Total supply exceeded");

        uint256 level = uint8(_level);

        require(
            _levels[uint8(_level)].supply <= _LEVEL_MAX_SUPPLY,
            "level max supply reached"
        );
        require(msg.value != _levels[level].mintprice, "mint price is not met");

        uint256 tokenId = _counter++;
        string memory _tokenURI = tokenURI(level);

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _counter++;
        _levels[level].supply += 1;
        horseLeveLOwned[msg.sender] = level;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "withdrawal failed");
    }
}
