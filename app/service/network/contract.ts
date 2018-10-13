import { observable, action, runInAction, computed } from 'mobx';
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

    @observable public updatedTime : Date = new Date();
    @observable public address : string;
    @observable public currentSize : string;
    @observable public fundRaisingPeriod : string;
    @observable public turnPeriod : string;
    @observable public currentSharePrice : string;
    @observable public currentSharePerProposal : string;
    @observable public fundRaisingCountingDown : boolean;
    @observable public countingStartedTime : string;
    @observable public teamCatFunding : string;
    @observable public teamDogFunding : string;
    @observable public userStatus : UserStatus;
    @observable public currentTurn : string;
    @observable public gameRound : string;

    @observable public autoTurn : string = '0';
    @observable public turnGap : number = 0;
    @observable public proposed : Array<{
        round : string,
        turn : string,
        proposer : string,
    }> = [];
    @observable public proposalStatus : {
        [proposal : string] : {
            vote : string,
            time : string,
        },
    } = {};

    // @observable public proposed : Array<any> = [];

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

    private contractHandler : HandlerInterface;
    private walletHandler : HandlerInterface;

    private contractManifest : ManifestInterface;
    private network : NetworkInterface;

    private looper;

    constructor(network : NetworkInterface) {
        this.network = network;
        this.init();
    }

    public getProposalId = (turn : string, addr : string) => `${turn}-${addr}`;
    public clearGame = () => this.writeWrapper('clearGame')([]);
    public startNewGame = () => this.writeWrapper('startNewGame')([]);

    public fund = (team : number, value : string) => {
        const wei = this.network.web3.utils.toWei(value);
        this.writeWrapper('funding')([team], wei);
    }
    public propose = async () => {
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
        this.writeWrapper('propose')([], total.toString());
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

    private async getContractState() {
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
                currentTurn,
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
                this.contractHandler.methods.currentTurn().call(),
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
                this.currentTurn = currentTurn;
                this.autoTurn = currentTurn;
            });
            const gameRound = await this.contractHandler.methods.gameRound().call();
            const pastProposed : Array<any> = await this.contractHandler.getPastEvents<any>(
                'proposed',
                { filter: { round: gameRound }, fromBlock: 0, toBlock: 'latest' }
            );
            runInAction(() => {
                this.gameRound = gameRound;
                const turn = this.currentTurn;
                this.proposed = pastProposed.map(({ returnValues }) => {
                    this.contractHandler.methods.getProposalStatus(
                        gameRound,
                        turn,
                        returnValues.proposer,
                    ).call().then(({ time, vote }) => {
                        console.log(time, vote);
                        runInAction(() => {
                            this.proposalStatus[this.getProposalId(turn, returnValues.proposer)] = {
                                time,
                                vote
                            };
                        });
                    });
                    return returnValues;
                });
            });
        }
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
            this.contractHandler.events.turnStart({}, (...arr) => {
                console.log('new turn start!', arr);
                this.getContractState();
            });

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
        }
    }

    private startLoop() {
        if (this.looper) {
            clearInterval(this.looper);
        }
        this.looper = setInterval(() => this.loop(), 1000);
    }

    @action
    private loop() {
        console.log('loop');
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
}

export default Contract;
