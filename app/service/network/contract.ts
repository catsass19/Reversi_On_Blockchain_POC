import { observable, action, runInAction, computed } from 'mobx';
import throttle from 'lodash/throttle';
import maxBy from 'lodash/maxBy';
import { ContractInterface, NetworkInterface, HandlerInterface } from './interface';

interface ManifestInterface {
    abi : Array<any>;
    contractName : string;
    networks : {
        [netId : string] : {
            address : string;
            transactionHash : string;
        }
    };
}

interface UserStatus {
    team : string;
    catShare : string;
    dogShare : string;
}

class Contract implements ContractInterface {

    public TEAM = {
        CAT: 2,
        DOG: 1,
        NONE: 0,
    };
    public GRID_STATUS = {
        EMPTY: '0',
        BLACK: '1',
        WHITE: '2',
        AVAILABLE: '3',
        PROPOSED: '4',
        FLIP: '5',
    };

    @observable public updatedTime : Date = new Date();
    @observable public address : string;
    @observable public currentSize : string;
    @observable public fundRaisingPeriod : string;
    @observable public turnPeriod : string;
    @observable public currentSharePrice : string;
    @observable public currentSharePerProposal : string;
    @observable public currentTeam : string;
    @observable public fundRaisingCountingDown : boolean;
    @observable public countingStartedTime : string;
    @observable public teamCatFunding : string;
    @observable public teamDogFunding : string;
    @observable public userStatus : UserStatus = { team: '', catShare: '', dogShare: '' };
    @observable public currentTurn : string;
    @observable public gameRound : string;
    @observable public boardStatus : Array<string> = [];
    @observable public black : string;
    @observable public white : string;
    @observable public messages : Array<{
        msg : string;
        round : string;
        sender : string;
        time : string;
     }> = [];

    @observable public autoTurn : string;
    @observable public turnGap : number = 0;
    @observable public proposed : Array<{
        round : string,
        turn : string,
        proposer : string,
    }> = [];
    @observable public proposalStatus : {
        [proposal : string] : {
            turn : string,
            vote : string,
            time : string,
            x : string,
            y : string,
        },
    } = {};

    @computed public get myTeam() {
        return this.getTeamName(this.userStatus.team);
    }
    @computed public get currentTeamName() {
        return this.getTeamName(this.currentTeam);
    }
    @computed public get forecastCurrentTeam() {
        let team;
        if (this.autoTurn === this.currentTurn) {
            team = this.currentTeam;
        } else if (Number(this.autoTurn) > Number(this.currentTurn)) {
            if (this.currentTurn === '0') {
                team = (Number(this.teamCatFunding) > Number(this.teamDogFunding))
                    ? this.TEAM.CAT
                    : this.TEAM.DOG;
            } else {
                team =  (Number(this.currentTeam) === this.TEAM.CAT)
                    ? this.TEAM.DOG
                    : this.TEAM.CAT;
            }
        }
        return this.getTeamName(team);
    }
    @computed public get autoTurnEndTime() {
        if (Number(this.autoTurn) > 0) {
            const endTime =
                Number(this.countingStartedTime) +
                Number(this.fundRaisingPeriod) +
                (Number(this.autoTurn) * Number(this.turnPeriod));
            return endTime;
        }
    }
    @computed public get gameResolvedAuto() {
        return this.fundRaisingCountingDown && (this.turnGap >= 2);
    }

    @computed public get currentTurnEndTime() {
        if (Number(this.currentTurn) > 0) {
            const endTime =
                Number(this.countingStartedTime) +
                Number(this.fundRaisingPeriod) +
                (Number(this.currentTurn) * Number(this.turnPeriod));
            return endTime;
        }
    }

    @computed public get proposalStatusArray() {
        const keys = Object.keys(this.proposalStatus);
        return keys.map((key) => this.proposalStatus[key]);
    }

    @computed public get flipForecast() {
        let forecast : {
            [id : string] : string
        } = {};
        if (Number(this.autoTurn) > Number(this.currentTurn)) {
            const lastTurnProposals = this.proposalStatusArray.filter((it) => it.turn === this.currentTurn);
            if (lastTurnProposals.length) {
                const max = maxBy(lastTurnProposals, (p) => Number(p.vote));
                const baseColor = this.getChessColorByTeam(this.currentTeam);
                const oppositeColor = (baseColor === this.GRID_STATUS.BLACK) ? this.GRID_STATUS.WHITE : this.GRID_STATUS.BLACK;
                const x = Number(max.x);
                const y = Number(max.y);
                forecast = {
                    [`${x}${y}`]: baseColor,
                    ...this.doFlip(x, y, 1, 1, baseColor, oppositeColor),
                    ...this.doFlip(x, y, 1, 0, baseColor, oppositeColor),
                    ...this.doFlip(x, y, 1, -1, baseColor, oppositeColor),
                    ...this.doFlip(x, y, 0, -1, baseColor, oppositeColor),
                    ...this.doFlip(x, y, -1, -1, baseColor, oppositeColor),
                    ...this.doFlip(x, y, -1, 0, baseColor, oppositeColor),
                    ...this.doFlip(x, y, -1, 1, baseColor, oppositeColor),
                    ...this.doFlip(x, y, 0, 1, baseColor, oppositeColor),
                };
                forecast = this.markAvailable(forecast, oppositeColor, baseColor);
            }

        }
        return forecast;
    }

    private contractHandler : HandlerInterface;
    private walletHandler : HandlerInterface;

    private contractManifest : ManifestInterface;
    private network : NetworkInterface;

    private looper;
    private getPastMessage : boolean = false;

    private getContractState = throttle(async () => {
        if (this.contractHandler) {
            const [
                currentSize,
                fundRaisingPeriod,
                turnPeriod,
                currentSharePrice,
                fundRaisingCountingDown,
                countingStartedTime,
                teamFundingStatus,
                userStatus,
                currentSharePerProposal,
            ] = await Promise.all([
                this.contractHandler.methods.currentSize().call(),
                this.contractHandler.methods.fundRaisingPeriod().call(),
                this.contractHandler.methods.turnPeriod().call(),
                this.contractHandler.methods.currentSharePrice().call(),
                this.contractHandler.methods.fundRaisingCountingDown().call(),
                this.contractHandler.methods.countingStartedTime().call(),
                this.contractHandler.methods.getTeamFundingStatus().call(),
                this.contractHandler.methods.getUserStatus(this.network.wallet).call(),
                this.contractHandler.methods.currentSharePerProposal().call(),
            ]);
            runInAction(() => {
                this.currentSize = currentSize;
                this.fundRaisingPeriod = fundRaisingPeriod;
                this.turnPeriod = turnPeriod;
                this.currentSharePrice = this.network.web3.utils.fromWei(currentSharePrice);
                this.fundRaisingCountingDown = fundRaisingCountingDown;
                this.countingStartedTime = countingStartedTime;
                this.teamCatFunding = teamFundingStatus[0];
                this.teamDogFunding = teamFundingStatus[1];
                this.userStatus = {
                    team: userStatus[1],
                    catShare: userStatus[2],
                    dogShare: userStatus[3],
                };
                this.currentSharePerProposal = currentSharePerProposal;
            });
            const [
                currentTeam,
                gameRound,
                boardStatus,
                black,
                white,
                currentTurn,
            ] = await Promise.all([
                this.contractHandler.methods.currentTeam().call(),
                this.contractHandler.methods.gameRound().call(),
                this.contractHandler.methods.getBoardStatus().call(),
                this.contractHandler.methods.black().call(),
                this.contractHandler.methods.white().call(),
                this.contractHandler.methods.currentTurn().call(),
            ]);
            const pastProposed : Array<any> = await this.contractHandler.getPastEvents<any>(
                'proposed',
                { filter: { round: gameRound }, fromBlock: 0, toBlock: 'latest' }
            );
            runInAction(() => {
                this.boardStatus = boardStatus;
                this.black = black;
                this.white = white;
                this.currentTeam = currentTeam;
                this.gameRound = gameRound;
                this.currentTurn = currentTurn;
                this.autoTurn = currentTurn;
                const turn = this.currentTurn;
                this.proposed = pastProposed.map(({ returnValues }) => {
                    this.contractHandler.methods.getProposalStatus(
                        gameRound,
                        turn,
                        returnValues.proposer,
                    ).call().then(({ time, vote, x, y }) => {
                        if (time !== '0') {
                            runInAction(() => {
                                this.proposalStatus[this.getProposalId(turn, returnValues.proposer)] = {
                                    turn,
                                    time,
                                    vote,
                                    x,
                                    y,
                                };
                            });
                        }
                    });
                    return returnValues;
                });
            });
            if (!this.getPastMessage && this.gameRound) {
                const pastMessages : Array<any> = await this.contractHandler.getPastEvents<any>(
                    'messagePost',
                    { filter: { round: gameRound }, fromBlock: 0, toBlock: 'latest' }
                );
                runInAction(() => {
                    pastMessages.map(({ returnValues}) => {
                        this.handleMessage(returnValues);
                    });
                });
            }
        }
    }, 200);

    constructor(network : NetworkInterface) {
        this.network = network;
        this.init();
    }

    public postMessage = (message : string) => this.writeWrapper('postMessage')([message]);
    public getProposalId = (turn : string, addr : string) => `${turn}-${addr}`;
    public clearGame = () => this.writeWrapper('clearGame')([]);
    public startNewGame = () => this.writeWrapper('startNewGame')([]);
    public getChessColorByTeam = (team : string) => {
        switch(team) {
            case `${this.TEAM.NONE}`:
                return undefined;
            case this.black:
                return this.GRID_STATUS.BLACK;
            case this.white:
                return this.GRID_STATUS.WHITE;
            default:
                return undefined;
        }
    }

    public fund = async (team : number, shares : string) => {
        const [
            sharePrice,
        ] = await Promise.all([
            this.contractHandler.methods.currentSharePrice().call(),
        ]);
        const sharePriceBig = new this.network.web3.utils.BN(sharePrice);
        const SharesBig = new this.network.web3.utils.BN(shares);
        const wei = sharePriceBig.mul(SharesBig);
        this.writeWrapper('funding')([team], wei.toString());
    }
    public propose = async (x : number, y : number) => {
        const [
            sharePrice,
            sharesPerProposal,
        ] = await Promise.all([
            this.contractHandler.methods.currentSharePrice().call(),
            this.contractHandler.methods.currentSharePerProposal().call(),
        ]);
        const sharePriceBig = new this.network.web3.utils.BN(sharePrice);
        const sharesPerProposalBig = new this.network.web3.utils.BN(sharesPerProposal);
        const total = sharePriceBig.mul(sharesPerProposalBig);
        this.writeWrapper('propose')([x, y], total.toString());
    }

    public vote = async (round : string, turn : string, proposer : string, shares : string) => {
        const [
            sharePrice,
        ] = await Promise.all([
            this.contractHandler.methods.currentSharePrice().call(),
        ]);
        const sharePriceBig = new this.network.web3.utils.BN(sharePrice);
        const SharesBig = new this.network.web3.utils.BN(shares);
        const wei = sharePriceBig.mul(SharesBig);
        this.writeWrapper('vote')([round, turn, proposer], wei);
    }

    private loadManifest = () => import('#/Deversi.json');

    private writeWrapper = (method : string) => {
        return (params : Array<any>, value? : string) => {
            if (this.walletHandler && this.network.wallet) {
                this.walletHandler
                    .methods[method](...params)
                    .send({ from: this.network.wallet, value: value || undefined })
                    .on('confirmation', () => {})
                    .on('receipt', (data) => {
                        console.log(`Successfully performed [${method}] with parameters: ${params}`);
                    })
                    .on('error', () => console.log('unexpected error'));
            }
        };
    }

    private async init() {
        this.contractManifest = (await this.loadManifest()).default;
        const address = await this.getContractAddress();
        runInAction(() => this.address = address);
        this.contractHandler = this.network.getContractHandler(this.contractManifest.abi, this.address);
        this.walletHandler = this.network.getWalletHandler(this.contractManifest.abi, this.address);
        this.getContractState();
        this.eventListener();
        this.startLoop();
    }
    private getContractAddress() : string {
        const netId = this.network.netId;
        const infoOnNetwork = this.contractManifest.networks[`${netId}`];
        return infoOnNetwork ? infoOnNetwork.address : '';
    }

    private eventListener() {
        if (this.contractHandler) {
            this.contractHandler.events.NewGameStarted({}, (...arr) => {
                console.log('NewGameStarted');
                this.getContractState();
                this.startLoop();
            });
            this.contractHandler.events.funded({}, (...arr) => {
                console.log('a team gets funded');
                this.getContractState();
            });
            this.contractHandler.events.fundRaisingCountdown({}, (...arr) => {
                console.log('start counting down!!!');
                this.getContractState();
            });
            // this.contractHandler.events.turnStart({}, (...arr) => {
            //     console.log('new turn start!', arr);
            //     this.getContractState();
            // });
            this.contractHandler.events.proposed({}, (t, { returnValues }) => {
                const { round, turn, proposer } = returnValues;
                this.getContractState();
                console.log('someonehad proposed', round, turn, proposer);
            });
            this.contractHandler.events.gameCleared({}, (t, { returnValues }) => {
                const { round, clearer } = returnValues;
                this.getContractState();
                console.log('game is cleared by', clearer);
            });
            this.contractHandler.events.voted({}, () => {
                console.log('someone voted!');
                this.getContractState();
            });
            // this.contractHandler.events.proposalSelected({}, (t, { returnValues }) => {
            //     // console.log('gsdf', returnValues);
            // });
            // this.contractHandler.events.flipEvent({}, (t, { returnValues }) => {
            //     console.log('FLIP!', returnValues);
            // });
            this.contractHandler.events.messagePost({}, (t, { returnValues }) => {
                this.handleMessage(returnValues);
            });
        }
    }

    private handleMessage(returnValues) {
        const { msg, round, sender, time } = returnValues;
        const date = new Date(Number(time) * 1000);
        runInAction(() => {
            this.messages.push({ msg, round, sender, time: date.toLocaleString('zh-TW', { timeZone: 'UTC' }) });
        });
    }

    private startLoop() {
        if (this.looper) {
            clearInterval(this.looper);
        }
        this.looper = setInterval(() => this.loop(), 500);
    }

    @action
    private loop() {
        let turn = 0;
        const contractTurn = Number(this.currentTurn);
        if (this.fundRaisingCountingDown) {
            const now = Math.floor(new Date().getTime() / 1000);
            const fundingEndTime = Number(this.countingStartedTime) + Number(this.fundRaisingPeriod);
            if (now > fundingEndTime) {
                turn = Math.ceil((now - fundingEndTime) / Number(this.turnPeriod));
            }
        }

        if (turn > contractTurn) {
            const turnGap = turn - Number(contractTurn);
            if (turnGap >= 2) {
                console.log('game is exptected to be ended!!');
                clearInterval(this.looper);
            }
            this.turnGap = turnGap;
        }
        this.autoTurn = `${turn}`;
    }

    private getTeamName(team) {
        switch(Number(team)) {
            case this.TEAM.CAT:
                return 'Cat Kōgekitai';
            case this.TEAM.DOG:
                return 'Dog Guerrilla';
            default:
                return;
        }
    }

    private markAvailable(forecast, base, opposite) {
        const size = Number(this.currentSize);
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const status = this.boardStatus[(size * x) + y];
                if (status === this.GRID_STATUS.AVAILABLE) {
                    forecast[`${x}${y}`] = this.GRID_STATUS.EMPTY;
                }
                const forecastStatus = this.getForecastStatus(x, y, forecast, size);
                if (forecastStatus === this.GRID_STATUS.EMPTY) {
                    if (this.markAvailble(x, y, forecast, base, opposite)) {
                        forecast[`${x}${y}`] = this.GRID_STATUS.AVAILABLE;
                    }
                }
            }
        }
        return forecast;
    }

    private markAvailble(x, y, forecast, base, opposite) {
        return (
            this.isAvailable(x, y, 1, 1, forecast, base, opposite) ||
            this.isAvailable(x, y, 1, 0, forecast, base, opposite) ||
            this.isAvailable(x, y, 1, -1, forecast, base, opposite) ||
            this.isAvailable(x, y, 0, -1, forecast, base, opposite) ||
            this.isAvailable(x, y, -1, -1, forecast, base, opposite) ||
            this.isAvailable(x, y, -1, 0, forecast, base, opposite) ||
            this.isAvailable(x, y, -1, 1, forecast, base, opposite) ||
            this.isAvailable(x, y, 0, 1, forecast, base, opposite)
        );
    }
    private isAvailable(x, y, offsetX, offsetY, forecast, base, opposite) {
        let currentX = x + offsetX;
        let currentY = y + offsetY;
        let flipCount = 0;
        let shouldFlip = false;
        const size = Number(this.currentSize);

        while(
            (currentX >= 0) &&
            (currentY >= 0) &&
            (currentX < size) &&
            (currentY < size)
        ) {
            const status = this.getForecastStatus(currentX, currentY, forecast, size);
            if (status === opposite) {
                flipCount += 1;
                currentX += offsetX;
                currentY += offsetY;
                continue;
            } else if (status === base) {
                shouldFlip = true;
                break;
            } else {
                shouldFlip = false;
                break;
            }
        }
        return ((flipCount > 0) && shouldFlip);
    }

    private getForecastStatus(x, y, forecast, size) {
        return forecast[`${x}${y}`] || this.boardStatus[(size * x) + y];
    }

    private doFlip = (x, y, offsetX, offsetY, baseColor, oppositeColor) => {
        const flip = {};
        let currentX = x + offsetX;
        let currentY = y + offsetY;
        let shouldFlip = false;
        const size = Number(this.currentSize);
        while(
            (currentX >= 0) &&
            (currentY >= 0) &&
            (currentX < size) &&
            (currentY < size)
        ) {
            const status = this.boardStatus[(size * currentX) + currentY];
            if (status === oppositeColor) {
                flip[`${currentX}${currentY}`] = baseColor;
                currentX += offsetX;
                currentY += offsetY;
            } else {
                shouldFlip = (status === baseColor);
                break;
            }
        }
        return shouldFlip ? flip : {};
    }
}

export default Contract;
