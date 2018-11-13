import { observable, computed, runInAction } from 'mobx';
import { NetworkInterface } from './interface';
import appService from '@/service/app';
import Contract from './contract';

declare global {
    interface Window {
        ethereum : any;
        web3 : any;
        dexon : any;
    }
}

class Network implements NetworkInterface {

    public NETWORK = {
        MAIN_NET: 'Ethereum Mainnet',
        RINKEBY: 'Ethereum Rinkeby',
        GANACHE: 'Ganache@local',
        DEXON_TESTNET: 'Dexon Testnet',
        UNKNOWN: '',
    };

    @observable public loaded : boolean = false;
    @observable public wallet : string;
    @observable public netId : number;
    @observable public contract : Contract;
    @observable public hasWallet : boolean;
    @observable public wsConnecting : boolean = true;
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
            case 237:
            case 238:
                return this.NETWORK.DEXON_TESTNET;

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
        const injectedProvider = window.dexon || window.ethereum;
        if (injectedProvider) {
            this.walletHandler = new web3.default(injectedProvider);
            appService.openModal('Please login to your wallet and allow Deversi to connect to your account');
            try {
                await injectedProvider.enable();
            } catch(e) {
                appService.openModal('You rejected the Connect Request. Pleasse refresh browser to proceed again');
                throw new Error();
            }
        } else if (window.web3) {
            this.walletHandler = new web3.default(window.web3.currentProvider);
        }

        if (this.walletHandler) {
            runInAction(() => {
                this.hasWallet = true;
            });
            await this.connectWallet();
            this.blockchainHandler = new web3.default(this.getWebsocketProvider());
            // this.blockchainHandler.on('error', () => {
            //     console.log('error on ws');
            // });
        }
        runInAction(() => {
            this.contract = new Contract(this);
            this.loaded = true;
        });

    }

    private wsErrorHandler = () => {
        console.error('ws error!!');
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
            netId = 238; // If we dont get net id from wallet, use Dexon Testnet
        }
        runInAction(() => {
            this.wallet = wallet;
            this.netId = netId;
            this.walletDetector();
        });
    }

    private walletDetector = async () => {
        const wallet = await this.getWalletAddress();
        try {
            const isListening = await this.blockchainHandler.eth.net.isListening();
            runInAction(() => {
                this.wsConnecting = isListening;
            });
        } catch(e) {
            runInAction(() => {
                this.wsConnecting = false;
            });
        }

        if (this.wallet !== wallet) {
            location.reload();
        } else {
            setTimeout(this.walletDetector, 1000);
        }
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
            case 5777:
                return `ws://${window.location.hostname}:8545`;
            case 238:
            case 237:
            default: {
                return (window.location.hostname === 'localhost')
                    ? 'ws://testnet.dexon.org:8546'
                    // : 'wss://ws-proxy.dexon.org';
                    : 'wss://ws-testnet.dexscan.org/v2/ws';
            }
        }
    }
}

const contractService = new Network();

export default contractService;
