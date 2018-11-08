import { observable, computed, runInAction } from 'mobx';
import { NetworkInterface } from './interface';
import Contract from './contract';

declare global {
    interface Window {
        ethereum : any;
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

    public web3 : any;

    private blockchainHandler;
    private walletHandler;

    constructor() {
        this.init();
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

    public getBalanceOfAddress = async (address : string) => {
        if (this.blockchainHandler) {
            const balance = await this.blockchainHandler.eth.getBalance(address);
            return balance;
        }
    }

    private getHandler = (target : string) => {
        return (abi : Array<any>, addr : string) => {
            if (this[target] && abi.length && addr) {
                return new this[target].eth.Contract(abi, addr);
            }
        };
    }

    private init = async () => {
        const web3 = await  import(/* webpackChunkName: "web3" */'web3');
        this.web3 = web3;
        if (window.ethereum) {
            this.walletHandler = new web3.default(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            this.walletHandler = new web3.default(window.web3.currentProvider);
        }
        await this.connectWallet();
        this.blockchainHandler = new web3.default(this.getWebsocketProvider());
        runInAction(() => {
            this.contract = new Contract(this);
            this.loaded = true;
        });
    }

    private connectWallet = async () => {
        let wallet;
        let netId;
        if (this.walletHandler) {
            const [
                walletAddr,
                id,
            ] = await Promise.all([
                this.getWalletAddress(),
                this.getNetId(),
            ]);
            wallet = walletAddr;
            netId = id;
        } else {
            netId = 4; // If we dont get net id from wallet, use Rinkeby
        }
        runInAction(() => {
            this.wallet = wallet;
            this.netId = netId;
        });
    }

    private getWalletAddress = async () : Promise<string> => {
        const addr = await this.walletHandler.eth.getAccounts();
        return addr[0];
    }
    private getNetId = () : Promise<number> => this.walletHandler.eth.net.getId();
    private getWebsocketProvider() {
        console.log('network id', this.netId);
        switch(this.netId) {
            case 1:
                return 'wss://mainnet.infura.io/_ws';
            case 4:
                return 'wss://rinkeby.infura.io/ws';
            case 237:
                return 'ws://testnet.dexon.org:8546';
            case 5777:
            default:
                return `ws://${window.location.hostname}:8545`;
        }
    }
}

const contractService = new Network();

export default contractService;
