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

    public getContractHandler = (abi : Array<any>, addr : string) => new this.blockchainHandler.eth.Contract(abi, addr);

    private loadResource = async () => {
        const blockchainHandler = await  import(/* webpackChunkName: "web3" */'web3');
        this.loaded = true;
        this.blockchainHandler = (window.web3)
            ? new blockchainHandler.default(window.web3.currentProvider)
            : new blockchainHandler.default(window.web3.currentProvider); // should be replaced as external provider
        this.connect();
    }

    private connect = async () => {
        const [
            walletAddr,
            netId,
        ] = await Promise.all([
            this.getWalletAddress(),
            this.getNetId(),
        ]);
        this.wallet = walletAddr;
        this.netId = netId;
        this.contract = new Contract(this);
    }

    private getWalletAddress = async () : Promise<string> => {
        const addr = await this.blockchainHandler.eth.getAccounts();
        return addr[0];
    }
    private getNetId = () : Promise<number> => this.blockchainHandler.eth.net.getId();
}

const contractService = new Network();

export default contractService;
