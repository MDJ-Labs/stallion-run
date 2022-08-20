// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

/// @title A Decentralized Horse Racing Game
/// @author Umair Mirza, John Nguyen
/// @notice This contract is for creating a decentralized horse racing game
/// @dev This contract implements Chainlink VRF and Chainlink Keepers

contract StallionRace is VRFConsumerBaseV2, KeeperCompatibleInterface {

    /* Events */
    event RaceEnter(address indexed player);
    event WinnerPicked(address indexed player);
    event HorseCreated(uint16 horseId, uint256 price, uint8 level, string name);
    event RequestedRaceWinner(uint256 indexed requestId);

    /* Type Declarations */
    enum RaceState {
        OPEN,
        INPROGRESS
    }

    struct Horse {
        uint16 horseId;
        uint256 price;
        uint8 level;
        string name;
    }

    /* State variables */
    address public s_owner;
    address private s_recentWinner;
    address payable[] private s_players;
    uint256 private immutable i_entranceFee;
    uint16 public s_horseId;
    uint32 private s_speedOfWinner;
    uint256 public s_raceAmount;
    RaceState private s_raceState;
    uint256[] public s_finalRamdom;

    Horse[] public horses;

    mapping (address => Horse) playerToHorse;

    /* Chainlink variables */

    VRFCoordinatorV2Interface private immutable i_COORDINATOR;
    // Your subscription ID.
    uint64 s_subscriptionId;
    // Goerli coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;
    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;
    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 1000000;
    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;
    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 private numWords;
    uint256[] public s_randomWords;
    //uint256 public s_requestId;


    /* Modifiers */
    modifier onlyOwner {
        require(msg.sender == s_owner, "Function caller is not Owner of the contract");
        _;
    }

    /* Functions */

    /// @notice Constructor takes an entrance fee and Chainlink Subscription ID as arguments
    /// @notice The Race state is set to OPEN in the constructor
    constructor(
        uint256 entranceFee, uint64 subscriptionId
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        i_entranceFee = entranceFee;
        s_raceState = RaceState.OPEN;

        s_owner = msg.sender;
    }

    /// @notice This creates a new horse that can be purchased later
    /// @notice Only owner of the contract is able to create a horse
    /// @notice A horse can be of a different level and higher levels offer a slightly better chance of winning the race
    /// @dev There are two types of horseId variables, one in storage, other in the struct
    /// @dev Storage horseId variable is used to create unique ids for each horse incremented by 1
    function createHorse(string memory _name, uint8 _level, uint256 _price) public onlyOwner {
        s_horseId = s_horseId + 1;
        horses.push(Horse(s_horseId, _price, _level, _name));

        emit HorseCreated(s_horseId, _price, _level, _name);
    }

    /// @notice Players can buy horse at the price set by the owner of the contract
    /// @notice Each player can own only one horse and cannot change their horse afterwards
    /// @dev After successful purchase, it assigns the horse to the playerToHorse mapping
    function buyHorse(uint32 _id) external payable {
        require(horses.length > 0, "No horses exist currently");
        if(playerToHorse[msg.sender].horseId != 0) {
            revert("Player already owns a horse");
        }
        require(msg.value >= horses[_id].price, "Amount is less than Horse Price");

        playerToHorse[msg.sender] = horses[_id];
    }

    /// @notice A player can enter the race by paying the entry fee set in the constructor
    /// @notice A player can only enter the race if he / she owns a horse
    function enterRace() public payable {
        require(playerToHorse[msg.sender].horseId > 0, "Player does not own any horse");
        require(msg.value >= i_entranceFee, "Amount is less than Entrance Fee");
        require(s_raceState == RaceState.OPEN, "Race is not Open");

        s_players.push(payable(msg.sender));

        s_raceAmount = s_raceAmount + msg.value;

        emit RaceEnter(msg.sender);
    }

    /// @dev This is the function that the Chainlink keeper nodes call
    /// @dev They look for 'upkeepNeeded' to return true

    function checkUpkeep(bytes memory /* checkData */) 
    public view override returns(bool upkeepNeeded, bytes memory /* performData */) {

        bool isOpen = s_raceState == RaceState.OPEN;
        bool enoughPlayers = s_players.length == 2;
        bool hasBalance = address(this).balance > 0;

        upkeepNeeded = (isOpen && enoughPlayers && hasBalance);
        // To get rid of the warning
        return (upkeepNeeded, "0x0");
    }

    // Assumes the subscription is funded sufficiently.
    function performUpkeep(bytes calldata /* performData */) external override {
        // Will revert if subscription is not set and funded.

        (bool upkeepNeeded, ) = checkUpkeep("");
        require(upkeepNeeded, "Upkeep not needed");

        s_raceState = RaceState.INPROGRESS;

        numWords = uint32(s_players.length);

        uint256 requestId = i_COORDINATOR.requestRandomWords(
        keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
        );

        emit RequestedRaceWinner(requestId);
    }

    /// @notice This function is an override to the virtual function in VRFConsumerBaseV2.sol contract
    /// @notice We assign the randomWords given by the fulfullRandomWords function to the storage array variable

    /// @notice This is where the real magic happens. Race will only start if there are exactly 3 players
    /// @notice Only the owner of the contract can initiate the Race and pick random winner
    /// @notice Number of random words will be equal to the number of players
    /// @notice Horse speed will be determined by the random number generated by Chainlink VRF
    /// @notice Horse speed will be between 50 and 99
    /// @notice With each higher horse level, speed will be incremented by Level * 3
    /// @notice Horse having the highest speed will be chosen as the winner of the race
    /// @notice All the combined entranceFee will be sent to the Winner address
    function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
    ) internal override {

        s_randomWords = randomWords;

        uint32 speedIncrement = 3;

        uint256 maxSpeed = 0;

        uint32 winnerSpeed;

        uint16 winnerIndex;

        address payable winner;

        for(uint16 i = 0; i < s_players.length; i++) {
            address playerAddress = s_players[i];

            //Generate a Pseudo Random number between 50 and 99

            uint32 randomGen = 50 + uint32(s_randomWords[i] % (99 - 50 + 1));
            s_finalRamdom.push(randomGen);
            uint32 playerSpeed = randomGen + (playerToHorse[playerAddress].level * speedIncrement);

            if(playerSpeed > maxSpeed) {
                maxSpeed = playerSpeed;
                winnerIndex = i;
                winnerSpeed = playerSpeed;
            }
        }

        winner = s_players[winnerIndex];

        s_recentWinner = winner;
        s_speedOfWinner = winnerSpeed;

        s_players = new address payable[](0);

        s_raceState = RaceState.OPEN;

        //Send the Total Collected Entry fee to the Winner
        (bool success, ) = s_recentWinner.call{value: s_raceAmount}("");
        if(success) {
            s_raceAmount = 0;
        } else {
            revert("Transaction failed");
        }

        emit WinnerPicked(winner);
    }

    /* Getters */

    /// @notice These are getter functions that can be used to gewt values of different state veriables

    function getEntranceFee() public view returns(uint) {
        return i_entranceFee;
    }

    function getRaceState() public view returns(RaceState) {
        return s_raceState;
    }

    function getPlayerHorse(address _player) public view returns(string memory) {
        return playerToHorse[_player].name;
    }

    function getNumPlayers() public view returns(uint) {
        return s_players.length;
    }

    function getPlayerAddress(uint16 index) public view returns(address) {
        return s_players[index];
    }

    function getRaceAmount() public view returns(uint256) {
        return s_raceAmount;
    }

    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getRecentWinner() public view returns(address, uint32) {
        return (s_recentWinner, s_speedOfWinner);
    }

    function getWinnerBalance() public view returns(uint) {
        return s_recentWinner.balance;
    }

}