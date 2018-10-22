pragma solidity ^0.4.24;

contract Deversi {

    enum _TEAM { NONE, DOG, CAT }
    enum _GRID_STATUS { EMPTY, BLACK, WHITE, AVAILABLE, PROPOSED, FLIP }

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
        uint256 x;
        uint256 y;
    }
    struct Flip {
        uint256 x;
        uint256 y;
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
    mapping(uint256 => mapping(uint256 => address[])) public proposedAddress;

    mapping(uint256 => mapping(uint256 => mapping(uint256 => int[]))) private flipX;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => int[]))) private flipY;

    event funded();
    event NewGameStarted(uint256 round, uint time);
    event fundRaisingCountdown(uint256 round, uint time);
    event turnStart(uint256 indexed round, uint256 turn, uint time);
    event proposed(uint256 indexed round, uint256 turn, address proposer, uint256 x, uint256 y);
    event gameCleared(uint256, address clearer);
    event voted(uint round, uint turn, address proposer, address voter, uint256 shares);
    event proposalSelected(uint round, uint turn, address proposer, uint256 vote);
    event flipEvent(uint turn, uint x, uint y);
    event messagePost(string msg, address sender, uint round, uint time);

    constructor() public {
        owner = msg.sender;
        gameRound = 0;
        inGame = false;
        configure(
            8, // size
            10, // funding period
            90,  // turn period
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

        boardStatus[gameRound][(currentSize / 2) + 1][(currentSize / 2) - 1] = _GRID_STATUS.AVAILABLE;
        boardStatus[gameRound][(currentSize / 2)][(currentSize / 2) - 2] = _GRID_STATUS.AVAILABLE;

        boardStatus[gameRound][(currentSize / 2) - 1][(currentSize / 2) + 1] = _GRID_STATUS.AVAILABLE;
        boardStatus[gameRound][(currentSize / 2) - 2][(currentSize / 2)] = _GRID_STATUS.AVAILABLE;

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

    function postMessage(string message) public onlyInGame {
        emit messagePost(message, msg.sender, gameRound, now);
    }

    function propose(uint256 x, uint256 y) public payable onlyInGame {
        uint256 gameStartTime = countingStartedTime + fundRaisingPeriod;
        require((fundRaisingCountingDown == true) && (now > gameStartTime), "not yet started");
        if (currentTurn == 0) {
            currentTurn += 1;
            if (currentFundingStatus.CAT >= currentFundingStatus.DOG) {
                currentTeam = _TEAM.CAT;
                black = _TEAM.CAT;
                white = _TEAM.DOG;
            } else {
                currentTeam = _TEAM.DOG;
                black = _TEAM.DOG;
                white = _TEAM.CAT;
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
                    updateGame();
                    doPropose(x, y);
                }
            }
        } else if ((now < currentRoundEndTime) && (now >= currentRoundStartTime)) {
            doPropose(x, y);
        }
    }

    function doPropose(uint256 x, uint256 y) private {
        User userTeam = userStatus[gameRound][msg.sender];
        require(userTeam.team == currentTeam, "You are not on this team");
        roundPropsedStatus[gameRound][currentTurn] = true;
        if (proposals[gameRound][currentTurn][msg.sender].isExist != true) {
            uint256 shares = msg.value / currentSharePrice;
            require(shares >= sharesPerProposal, "Not enough fund");
            require(boardStatus[gameRound][x][y] == _GRID_STATUS.AVAILABLE, "Unavailable");
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
            proposals[gameRound][currentTurn][msg.sender].x = x;
            proposals[gameRound][currentTurn][msg.sender].y = y;
            boardStatus[gameRound][x][y] = _GRID_STATUS.PROPOSED;
            proposedAddress[gameRound][currentTurn].push(msg.sender);
            emit proposed(gameRound, currentTurn, msg.sender, x, y);
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
        uint256 proposedLength = proposedAddress[gameRound][currentTurn].length;
        address highestAddress = proposedAddress[gameRound][currentTurn][0];
        uint256 highestAmount = proposals[gameRound][currentTurn][highestAddress].vote;
        for (uint i = 1; i < proposedLength; i++) {
            address _addr = proposedAddress[gameRound][currentTurn][i];
            Proposal _proposal = proposals[gameRound][currentTurn][_addr];
            if (_proposal.vote > highestAmount) {
                highestAddress = _addr;
                highestAmount = _proposal.vote;
            }
        }
        Proposal selected = proposals[gameRound][currentTurn][highestAddress];
        if (black == currentTeam) {
            boardStatus[gameRound][selected.x][selected.y] = _GRID_STATUS.BLACK;
        } else if (white == currentTeam) {
            boardStatus[gameRound][selected.x][selected.y] = _GRID_STATUS.WHITE;
        }
        // reverting calculation here...
        flip(selected.x, selected.y);
        // emit proposalSelected(gameRound, currentTurn, highestAddress, highestAmount);
        currentTurn += 1;
        _GRID_STATUS base;
        _GRID_STATUS opposite;
        if (currentTeam == black) {
            base = _GRID_STATUS.WHITE;
            opposite = _GRID_STATUS.BLACK;
        } else if (currentTeam == white) {
            base = _GRID_STATUS.BLACK;
            opposite = _GRID_STATUS.WHITE;
        }
        checkAvailable(base, opposite);
        currentTeam = (currentTeam == _TEAM.CAT) ? _TEAM.DOG : _TEAM.CAT;
        // emit turnStart(gameRound, currentTurn, now);
    }

    function checkAvailable(_GRID_STATUS base, _GRID_STATUS opposite) private returns(bool) {
        bool available = false;
        for (int x = 0; x < int(currentSize); x++) {
            for (int y = 0; y < int(currentSize); y++) {
                _GRID_STATUS status = boardStatus[gameRound][uint(x)][uint(y)];
                if (
                    (status != _GRID_STATUS.BLACK) &&
                    (status != _GRID_STATUS.WHITE)
                ) {
                    boardStatus[gameRound][uint(x)][uint(y)] = _GRID_STATUS.EMPTY;
                    if (markAvailable(x, y, base, opposite)) {
                        boardStatus[gameRound][uint(x)][uint(y)] = _GRID_STATUS.AVAILABLE;
                        available = true;
                    }
                }
            }
        }
        return available;
    }

    function markAvailable(int x, int y, _GRID_STATUS base, _GRID_STATUS opposite) private returns(bool) {
        bool dir1 = isAvailable(x, y, 1, 1, base, opposite);
        bool dir2 = isAvailable(x, y, 1, 0, base, opposite);
        bool dir3 = isAvailable(x, y, 1, -1, base, opposite);
        bool dir4 = isAvailable(x, y, 0, -1, base, opposite);
        bool dir5 = isAvailable(x, y, -1, -1, base, opposite);
        bool dir6 = isAvailable(x, y, -1, 0, base, opposite);
        bool dir7 = isAvailable(x, y, -1, 1, base, opposite);
        bool dir8 = isAvailable(x, y, 0, 1, base, opposite);
        return (
            dir1 || dir2 || dir3 || dir4 || dir5 || dir6 || dir7 || dir8
        );
    }
    function isAvailable(
        int x, int y, int offsetX, int offsetY,
        _GRID_STATUS base, _GRID_STATUS opposite
    ) private returns (bool) {
        int currentX = x + offsetX;
        int currentY = y + offsetY;
        int flipCount = 0;
        bool shouldFlip = false;
        while(
            (currentX >= 0) &&
            (currentY >= 0) &&
            (currentX < int(currentSize)) &&
            (currentY < int(currentSize))
        ) {
            _GRID_STATUS status = boardStatus[gameRound][uint(currentX)][uint(currentY)];
            if (status == opposite) {
                flipCount += 1;
                currentX += offsetX;
                currentY += offsetY;
                continue;
            } else if (status == base) {
                shouldFlip = true;
                break;
            } else {
                shouldFlip = false;
                break;
            }
        }
        return ((flipCount > 0) && shouldFlip);
    }

    function flip(uint256 x, uint256 y) {
        _GRID_STATUS base = boardStatus[gameRound][x][y];
        _GRID_STATUS opposite;
        if (base == _GRID_STATUS.BLACK) {
            opposite = _GRID_STATUS.WHITE;
        } else if (base == _GRID_STATUS.WHITE) {
            opposite = _GRID_STATUS.BLACK;
        }
        markFlip(x, y, 1, 1, base, opposite, 0);
        markFlip(x, y, 1, 0, base, opposite, 1);
        markFlip(x, y, 1, -1, base, opposite, 2);
        markFlip(x, y, 0, -1, base, opposite, 3);
        markFlip(x, y, -1, -1, base, opposite, 4);
        markFlip(x, y, -1, 0, base, opposite, 5);
        markFlip(x, y, -1, 1, base, opposite, 6);
        markFlip(x, y, 0, 1, base, opposite, 7);
        flipAll(base);
    }
    function flipAll(_GRID_STATUS base) {
        for (uint i = 0; i < currentSize; i++) {
            for(uint j = 0; j < currentSize; j++) {
                if (boardStatus[gameRound][i][j] == _GRID_STATUS.FLIP) {
                    boardStatus[gameRound][i][j] = base;
                }
            }
        }
    }
    function markFlip(
        uint256 x, uint256 y, int256 offsetX, int256 offsetY,
        _GRID_STATUS base, _GRID_STATUS opposite, uint256 direction
    ) private {
        int currentX = int(x) + offsetX;
        int currentY = int(y) + offsetY;
        bool shouldFlip = false;
        uint index = 0;
        while(
            (currentX >= 0) &&
            (currentY >= 0) &&
            (currentX < int(currentSize)) &&
            (currentY < int(currentSize))
        ) {
            _GRID_STATUS status = boardStatus[gameRound][uint(currentX)][uint(currentY)];
            if (status == _GRID_STATUS.FLIP) {
                currentX += offsetX;
                currentY += offsetY;
                continue;
            } else if (status == opposite)  {
                flipX[gameRound][currentTurn][direction].push(currentX);
                flipY[gameRound][currentTurn][direction].push(currentY);

                index++;
                currentX += offsetX;
                currentY += offsetY;
                continue;
            } else {
                if (status == base) {
                    shouldFlip = true;
                    break;
                } else {
                    shouldFlip = false;
                    break;
                }

            }
        }

        if (shouldFlip) {
            for (uint i = 0; i < index; i++) {
                boardStatus[gameRound][uint(flipX[gameRound][currentTurn][direction][i])][uint(flipY[gameRound][currentTurn][direction][i])] = _GRID_STATUS.FLIP;
            }
        }

    }

    function clearGame() public onlyInGame {
        // revert("game over!");
        inGame = false;
        // distribute money
        emit gameCleared(gameRound, msg.sender);

    }

    function getBoardStatus() public view returns (
        _GRID_STATUS[]
    ) {
        _GRID_STATUS[] memory ret = new _GRID_STATUS[](currentSize * currentSize);
        for (uint i = 0; i < currentSize; i++) {
            for (uint j = 0; j < currentSize; j++) {
                ret[(i * currentSize) + j] = boardStatus[gameRound][i][j];
            }
        }
        return (ret);
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
        uint256 time,
        uint x,
        uint y
    ) {
        Proposal status = proposals[round][turn][proposer];
        if (status.isExist) {
            return (status.vote, status.time, status.x, status.y);
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