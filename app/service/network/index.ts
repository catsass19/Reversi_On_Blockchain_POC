import { observable, computed } from 'mobx';
import { NetworkInterface } from './interface';
import Contract from './contract';

declare global {
    interface Window {
        web3 : any;
    }
}

class Network implements NetworkInterface {

    public NETWORK = {
        MAIN_NET: 'Ethereum Mainnet',
        RINKEBY: 'Ethereum Rinkeby',
        GANACHE: 'Ganache@local',
        UNKNOWN: '',
    };

    @observable public loaded : boolean = false;
    @observable public wallet : string;
    @observable public netId : number;
    @observable public contract : Contract;

    private blockchainHandler;
    private walletHandler;

    constructor() {
        this.loadResource();
    }

    @computed public get network() : string {
        switch(this.netId) {
            case 1:
                return this.NETWORK.MAIN_NET;
            case 4:
                return this.NETWORK.RINKEBY;
            case 5777:
                return this.NETWORK.GANACHE;
            default:
                return this.NETWORK.UNKNOWN;
        }
    }

    public getContractHandler = (abi : Array<any>, addr : string) => this.getHandler('blockchainHandler')(abi, addr);
    public getWalletHandler = (abi : Array<any>, addr : string) => this.getHandler('walletHandler')(abi, addr);

    private getHandler = (target : string) => {
        return (abi : Array<any>, addr : string) => {
            if (this[target] && abi.length && addr) {
                return new this[target].eth.Contract(abi, addr);
            }
        };
    }

    private loadResource = async () => {
        const blockchainHandler = await  import(/* webpackChunkName: "web3" */'web3');
        this.loaded = true;
        this.blockchainHandler = new blockchainHandler.default(this.getWebsocketProvider());
        this.walletHandler = (window.web3) ? new blockchainHandler.default(window.web3.currentProvider) : null;
        this.connect();
    }

    private connect = async () => {
        if (this.walletHandler) {
            const [
                walletAddr,
                netId,
            ] = await Promise.all([
                this.getWalletAddress(),
                this.getNetId(),
            ]);
            this.wallet = walletAddr;
            this.netId = netId;

        } else {
            this.netId = 4;
        }
        this.contract = new Contract(this);
    }

    private getWalletAddress = async () : Promise<string> => {
        const addr = await this.walletHandler.eth.getAccounts();
        return addr[0];
    }
    private getNetId = () : Promise<number> => this.walletHandler.eth.net.getId();
    private getWebsocketProvider() {
        switch(this.netId) {
            case 1:
                return 'wss://mainnet.infura.io/_ws';
            case 4:
                return 'wss://rinkeby.infura.io/ws';
            case 5777:
            default:
                return 'ws://localhost:8545';
        }
    }
}

const contractService = new Network();

export default contractService;
