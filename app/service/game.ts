import range from 'lodash/range';
import { observable } from 'mobx';

class GameService {

    public size : number = 6;
    public gridStatus = {
        BLACK: Symbol('black'),
        WHITE: Symbol('white'),
        AVAILABLE: Symbol('available'),
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

    private kimKickoffInterval = null;
    private trumpKickoffInterval = null;

    constructor() {
        this.resetState();
        this.startKickoff();
    }

    public setTeam(isTrump : boolean) {
        this.myTeam = isTrump ? this.team.TRUMP : this.team.KIM;
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
    private startKickoff() {
        this.kimKickoffInterval = setInterval(() => {
            this.kimKickoffFund += 4;
        }, 500);
        this.trumpKickoffInterval = setInterval(() => {
            this.trumpKickoffFund += 6;
        }, 1000);
    }


}

const gameService = new GameService();

export default gameService;
