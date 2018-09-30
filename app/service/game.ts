import range from 'lodash/range';
import { observable } from 'mobx';

class GameService {

    public size : number = 6;
    public gridStatus = {
        BLACK: Symbol('black'),
        WHITE: Symbol('white'),
        AVAILABLE: Symbol('available'),
        PROPOSED: Symbol('proposed'),
    };
    public team = {
        TRUMP: Symbol('trump'),
        KIM: Symbol('kim'),
    };

    @observable public state = [];
    @observable public start = false;

    @observable public kimKickoffFund : number = 0;
    @observable public trumpKickoffFund : number = 0;
    @observable public myTeam : symbol = null;
    @observable public turn : number = 1;
    @observable public proposed = null;

    @observable public rank1Fund = 100;
    @observable public rank2Fund = 80;
    @observable public rank3Fund = 0;
    @observable public second = 59;

    private kimKickoffInterval = null;
    private trumpKickoffInterval = null;
    private rank1interval = null;
    private rank2interval = null;

    constructor() {
        this.resetState();
        this.startKickoff();
        setInterval(() => {
            this.second = this.second - 1;
            if (this.second < 0) {
                this.second = 59;
            }
        }, 1000);
    }

    public setTeam(isTrump : boolean) {
        this.myTeam = isTrump ? this.team.TRUMP : this.team.KIM;
        this.stopKickOffFundRaising();
        this.start = true;
        this.addAvailableGrid();
        this.startRank();
    }

    public propose(x, y) {
        this.proposed = { x, y };
    }

    private resetState() {
        const state = [];
        const size = range(this.size);
        size.forEach(() => {
            state.push(size.map(() => null));
        });
        state[(this.size / 2) - 1][(this.size / 2) - 1] = state[this.size / 2][this.size / 2] = this.gridStatus.BLACK;
        state[this.size / 2][(this.size / 2) - 1] = state[(this.size / 2) - 1][this.size / 2] = this.gridStatus.WHITE;
        this.state = state;
    }
    private addAvailableGrid() {
        const state = this.state;
        state[1][3] = state[2][4] = this.gridStatus.AVAILABLE;
        state[3][1] = state[4][2] = this.gridStatus.PROPOSED;
    }
    private startKickoff() {
        this.kimKickoffInterval = setInterval(() => {
            this.kimKickoffFund += 4;
        }, 500);
        this.trumpKickoffInterval = setInterval(() => {
            this.trumpKickoffFund += 6;
        }, 1000);
    }
    private stopKickOffFundRaising() {
        clearInterval(this.kimKickoffInterval);
        clearInterval(this.trumpKickoffInterval);
    }

    private startRank() {
        this.rank1interval = setInterval(() => {
            this.rank1Fund += 5;
        }, 1000);
        this.rank2interval = setInterval(() => {
            this.rank2Fund += 4;
        }, 3000);
    }

}

const gameService = new GameService();

export default gameService;
