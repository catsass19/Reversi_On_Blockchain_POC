pragma solidity ^0.4.24;

contract Deversi {

    enum _TEAM { NONE, DOG, CAT }
    enum _GRID_STATUS { EMPTY, BLACK, WHITE, AVAILABLE, PROPOSED }

    struct Ledger {
        uint256 CAT;
        uint256 DOG;
    }
    struct User {
        _TEAM team;
        Ledger ledger;
        bool isExist;
    }
    struct Proposal {
        uint256 vote;
        uint256 time;
        bool isExist;
    }

    // System config
    uint256 public size; // board size
    address public owner;
    uint256 public fundRaisingPeriod;
    uint256 public turnPeriod;
    uint256 public baseSharePrice;
    uint256 public shareGrowthRate;
    uint256 public sharesPerProposal;

    // Game control
    bool public inGame;
    uint256 public gameRound;
    uint256 public currentSize;
    uint256 public currentTurn;
    uint256 public currentSharePrice;
    uint256 public currentSharePerProposal;
    uint256 public currentShareGrowthRate;
    Ledger public currentFundingStatus;
    bool public fundRaisingCountingDown;
    uint256 public countingStartedTime;
    _TEAM public currentTeam;
    _TEAM public black;
    _TEAM public white;

    // mapping(uint256 => _GRID_STATUS[][]) public boardStatus;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => _GRID_STATUS))) public boardStatus;
    mapping(uint256 => mapping(address => User)) public userStatus;
    mapping(uint256 => mapping(uint => bool)) public roundPropsedStatus;
    mapping(uint256 => mapping(uint256 => mapping(address => Proposal))) public proposals;

    event funded();
    event NewGameStarted(uint256 round, uint time);
    event fundRaisingCountdown(uint256 round, uint time);
    event turnStart(uint256 indexed round, uint256 turn, uint time);
    event proposed(uint256 indexed round, uint256 turn, address proposer);
    event gameCleared(uint256, address clearer);
    event voted(uint roung, uint turn, address proposer, address voter, uint256 shares);

    constructor() public {
        owner = msg.sender;
        gameRound = 0;
        inGame = false;
        configure(
            8, // size
            10, // funding period
            60,  // turn period
            1000000000000000,
            5,
            10
        );
        startNewGame();
    }

    function startNewGame() public {
        require(inGame == false, "game is going on");
        gameRound = gameRound + 1;
        currentSize = size;
        currentTurn = 0;
        currentSharePrice = baseSharePrice;
        currentSharePerProposal = sharesPerProposal;
        currentShareGrowthRate = shareGrowthRate;
        sharesPerProposal = 10;
        fundRaisingCountingDown = false;
        countingStartedTime = 0;
        currentTeam = _TEAM.NONE;
        black = _TEAM.NONE;
        white = _TEAM.NONE;
        currentFundingStatus.CAT = 0;
        currentFundingStatus.DOG = 0;
        inGame = true;
        boardStatus[gameRound][(currentSize / 2) - 1][(currentSize / 2) - 1] = _GRID_STATUS.BLACK;
        boardStatus[gameRound][(currentSize / 2)][(currentSize / 2)] = _GRID_STATUS.BLACK;
        boardStatus[gameRound][(currentSize / 2)][(currentSize / 2) - 1] = _GRID_STATUS.WHITE;
        boardStatus[gameRound][(currentSize / 2) - 1][(currentSize / 2)] = _GRID_STATUS.WHITE;
        emit NewGameStarted(gameRound, now);
    }

    function funding(_TEAM teamChoosen) public payable onlyInGame {
        require(currentTurn == 0, "funding is only allowed at turn 0");
        require(msg.value > 0, "Funds required");
        if (fundRaisingCountingDown) {
            require(now <= (countingStartedTime + fundRaisingPeriod), "funding is over");
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
        emit funded();
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

    function propose() public payable onlyInGame {
        uint256 gameStartTime = countingStartedTime + fundRaisingPeriod;
        require((fundRaisingCountingDown == true) && (now > gameStartTime), "not yet started");
        if (currentTurn == 0) {
            currentTurn += 1;
            if (currentFundingStatus.CAT >= currentFundingStatus.DOG) {
                currentTeam = _TEAM.CAT;
                black = _TEAM.CAT;
            } else {
                currentTeam = _TEAM.DOG;
                white = _TEAM.DOG;
            }

            emit turnStart(gameRound, currentTurn, now);
        }
        uint256 currentRoundEndTime = gameStartTime + (currentTurn * turnPeriod);
        uint256 currentRoundStartTime = currentRoundEndTime - turnPeriod;
        if (now > currentRoundEndTime) {
            if (roundPropsedStatus[gameRound][currentTurn] != true) {
                revert("Game should be cleared because previous turn isn't played");
            } else {
                uint256 nextRoundEndTime = currentRoundEndTime + turnPeriod;
                if (now > nextRoundEndTime) {
                    revert("Game over");
                } else {
                    currentTurn += 1;
                    updateGame();
                    doPropose();
                }
            }
        } else if ((now < currentRoundEndTime) && (now >= currentRoundStartTime)) {
            doPropose();
        }
    }

    function doPropose() private {
        User userTeam = userStatus[gameRound][msg.sender];
        require(userTeam.team == currentTeam, "You are not on this team");
        roundPropsedStatus[gameRound][currentTurn] = true;
        if (proposals[gameRound][currentTurn][msg.sender].isExist != true) {
            uint256 shares = msg.value / currentSharePrice;
            require(shares >= sharesPerProposal, "Not enough fund");
            proposals[gameRound][currentTurn][msg.sender].vote = shares - sharesPerProposal;
            proposals[gameRound][currentTurn][msg.sender].isExist = true;
            proposals[gameRound][currentTurn][msg.sender].time = now;
            if (userTeam.team == _TEAM.CAT) {
                userStatus[gameRound][msg.sender].ledger.CAT += shares;
                currentFundingStatus.CAT += shares;
            } else if (userTeam.team == _TEAM.DOG) {
                userStatus[gameRound][msg.sender].ledger.DOG += shares;
                currentFundingStatus.DOG += shares;
            }
            emit proposed(gameRound, currentTurn, msg.sender);
        } else {
            revert("You've already propsed in this turn");
        }
    }

    function vote(uint256 round, uint256 turn, address proposer) public payable onlyInGame {
        require(gameRound == round, "not in current round");
        require(currentTurn > 0, "not yet started");
        require(turn == currentTurn, "Not in current turn");
        uint256 gameStartTime = countingStartedTime + fundRaisingPeriod;
        uint256 currentRoundEndTime = gameStartTime + (currentTurn * turnPeriod);
        uint256 currentRoundStartTime = currentRoundEndTime - turnPeriod;
        require((now < currentRoundEndTime) && (now >= currentRoundStartTime), "not in round period");
        if (proposals[round][turn][proposer].isExist) {
            uint256 sharesToVote = msg.value / currentSharePrice;
            proposals[round][turn][proposer].vote += sharesToVote;
            if (currentTeam == _TEAM.CAT) {
                userStatus[gameRound][msg.sender].ledger.CAT += sharesToVote;
                currentFundingStatus.CAT += sharesToVote;
            } else if (currentTeam == _TEAM.DOG) {
                userStatus[gameRound][msg.sender].ledger.DOG += sharesToVote;
                currentFundingStatus.DOG += sharesToVote;
            }
            emit voted(gameRound, currentTurn, proposer, msg.sender, sharesToVote);
        } else {
            revert("proposal not exist");
        }
    }

    function updateGame() private {
        currentTeam = (currentTeam == _TEAM.CAT) ? _TEAM.DOG : _TEAM.CAT;
        emit turnStart(gameRound, currentTurn, now);
    }

    function clearGame() public onlyInGame {
        // revert("game over!");
        inGame = false;
        // distribute money
        emit gameCleared(gameRound, msg.sender);

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

    function getProposalStatus(uint256 round, uint256 turn, address proposer) public view returns (
        uint256 vote,
        uint256 time
    ) {
        Proposal status = proposals[round][turn][proposer];
        if (status.isExist) {
            return (status.vote, status.time);
        }
    }

    function configure(
        uint256 _size,
        uint256 _fundRaisingPeriod,
        uint256 _turnPeriod,
        uint256 _baseSharePrice,
        uint256 _shareGrowthRate,
        uint256 _sharesPerProposal
    ) public onlyOwner {
        size = _size;
        fundRaisingPeriod = _fundRaisingPeriod;
        turnPeriod = _turnPeriod;
        baseSharePrice = _baseSharePrice;
        shareGrowthRate = _shareGrowthRate;
        sharesPerProposal = _sharesPerProposal;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed");
        _;
    }
    modifier onlyInGame() {
        require(inGame == true, "Not in game period");
        _;
    }
}