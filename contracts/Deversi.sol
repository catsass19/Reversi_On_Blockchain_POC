pragma solidity ^0.4.24;

contract Deversi {

    uint8 public INIT_SIZE = 6;
    uint32 public INIT_RAISING_PERIOD = 120;
    uint32 public INIT_TURN_PERIOD = 60;
    uint256 public INIT_SHARE_PRICE = 1000000000000000;
    uint8 public INIT_SHARE_GROWTH_RATE = 5;
    enum _TEAM { CAT, DOG, NONE }

    struct Ledger {
        uint256 CAT;
        uint256 DOG;
    }
    struct User {
        _TEAM team;
        Ledger ledger;
        bool isExist;
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
    uint8 public currentSize;
    uint16 public currentTurn;
    uint256 public currentSharePrice;
    Ledger public currentFundingStatus;
    bool public fundRaisingCountingDown;
    uint256 public countingStartedTime;
    _TEAM public currentTeam;

    mapping(uint32 => mapping(address => User)) public userStatus;

    string public myString = "Hello World2";
    event StringUpdated();
    event NewGameStarted(uint32 round, uint time);
    event fundRaisingCountdown(uint32 round, uint time);

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
        currentSize = size;
        currentTurn = 0;
        currentSharePrice = baseSharePrice;
        fundRaisingCountingDown = false;
        currentTeam = _TEAM.NONE;
        currentFundingStatus.CAT = 0;
        currentFundingStatus.DOG = 0;
        emit NewGameStarted(gameRound, now);
    }

    function funding(_TEAM teamChoosen) public payable {
        require(currentTurn == 0, "funding is only allowed at turn 0");
        require(msg.value > 0, "Funds required");
        if (fundRaisingCountingDown) {
            require(now < (countingStartedTime + fundRaisingPeriod), "funding is over");
            // turn start trigger point
        }
        require(userStatus[gameRound][msg.sender].isExist != true, "Already funded!");

        uint shareAmount = msg.value / currentSharePrice;
        if (teamChoosen == _TEAM.CAT) {
            userStatus[gameRound][msg.sender].ledger.CAT = shareAmount;
            currentFundingStatus.CAT += shareAmount;
        } else if (teamChoosen == _TEAM.DOG) {
            userStatus[gameRound][msg.sender].ledger.DOG = shareAmount;
            currentFundingStatus.DOG += shareAmount;
        } else {
            revert("Invalid team");
        }
        userStatus[gameRound][msg.sender].team = teamChoosen;
        userStatus[gameRound][msg.sender].isExist = true;
        if (fundRaisingCountingDown == false) {
            if (
                (currentFundingStatus.CAT > 0) &&
                (currentFundingStatus.DOG > 0)
            ) {
                fundRaisingCountingDown = true;
                countingStartedTime = now;
                emit fundRaisingCountdown(gameRound, now);
            }
        }
    }

    function getUserStatus(address addr) public view returns (
        bool isExist,
        _TEAM team,
        uint256 CAT,
        uint256 DOG
    ) {
        isExist = userStatus[gameRound][addr].isExist;
        team = userStatus[gameRound][addr].team;
        CAT = userStatus[gameRound][addr].ledger.CAT;
        DOG = userStatus[gameRound][addr].ledger.DOG;
        return (isExist, team, CAT, DOG);
    }
    function getTeamFundingStatus() public view returns(
        uint256 CAT,
        uint256 DOG
    ) {
        CAT = currentFundingStatus.CAT;
        DOG = currentFundingStatus.DOG;
        return (CAT, DOG);
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