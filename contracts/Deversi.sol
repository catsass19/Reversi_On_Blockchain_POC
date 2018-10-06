pragma solidity ^0.4.24;

contract Deversi {

    uint8 public INIT_SIZE = 6;
    uint32 public INIT_RAISING_PERIOD = 60;
    uint32 public INIT_TURN_PERIOD = 60;
    uint256 public INIT_SHARE_PRICE = 1000000000000000;
    uint8 public INIT_SHARE_GROWTH_RATE = 5;
    enum _TEAM { BULL, BEAR, NONE }

    struct Ledger {
        uint256 BULL;
        uint256 BEAR;
    }
    struct User {
        _TEAM team;
        Ledger ledger;
    }

    // System config
    uint8 public size; // board size
    address public owner;
    uint32 public fundRaisingPeriod;
    uint32 public turnPeriod;
    uint256 public baseSharePrice;
    uint8 public shareGrowthRate;

    // Game control
    uint32 public gameRound;
    uint16 public currentTurn;
    uint256 public currentSharePrice;
    bool public fundRaisingCountingDown;
    uint256 public countingStartedTime;
    _TEAM public currentTeam;

    mapping(uint32 => mapping(address => User)) public userStatus;

    string public myString = "Hello World2";
    event StringUpdated();

    constructor() public {
        owner = msg.sender;
        gameRound = 0;
        configure(
            INIT_SIZE,
            INIT_RAISING_PERIOD,
            INIT_TURN_PERIOD,
            INIT_SHARE_PRICE,
            INIT_SHARE_GROWTH_RATE
        );
        startNewGame();
    }

    function startNewGame() private {
        gameRound = gameRound + 1;
        currentTurn = 0;
        currentSharePrice = baseSharePrice;
        fundRaisingCountingDown = false;
        currentTeam = _TEAM.NONE;
    }

    function set(string x) public {
        myString = x;
        emit StringUpdated();
    }

    function configure(
        uint8 _size,
        uint32 _fundRaisingPeriod,
        uint32 _turnPeriod,
        uint256 _baseSharePrice,
        uint8 _shareGrowthRate
    ) public onlyOwner {
        size = _size;
        fundRaisingPeriod = _fundRaisingPeriod;
        turnPeriod = _turnPeriod;
        baseSharePrice = _baseSharePrice;
        shareGrowthRate = _shareGrowthRate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed");
        _;
    }
}