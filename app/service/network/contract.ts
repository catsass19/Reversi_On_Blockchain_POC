import { observable, action, runInAction } from 'mobx';
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

class Contract implements ContractInterface {

    @observable public updatedTime : Date = new Date();
    @observable public address : string;
    @observable public myString : string;

    private contractHandler : HandlerInterface;
    private walletHandler : HandlerInterface;

    private contractManifest : ManifestInterface;
    private network : NetworkInterface;

    constructor(network : NetworkInterface) {
        this.network = network;
        this.init();
    }

    public setString = (str : string) => this.writeWrapper('set')(str);

    private loadManifest = () => import('#/Deversi.json');

    private writeWrapper = (method : string) => {
        return (...arr) => {
            if (this.walletHandler && this.network.wallet) {
                this.walletHandler
                    .methods[method](...arr)
                    .send({ from: this.network.wallet })
                    .on('confirmation', () => {})
                    .on('receipt', (data) => {
                        console.log(`Successfully performed [${method}] with parameters: ${arr}`);
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
    }
    private getContractAddress() : string {
        const netId = this.network.netId;
        const infoOnNetwork = this.contractManifest.networks[`${netId}`];
        return infoOnNetwork ? infoOnNetwork.address : '';
    }

    private async getContractState() {
        if (this.contractHandler) {
            const myStr = await this.contractHandler.methods.myString().call();
            this.updateContractState(myStr);
        }
    }

    @action
    private updateContractState(str : string) {
        this.myString = str;
        this.updatedTime = new Date();
    }

    private eventListener() {
        if (this.contractHandler) {
            this.contractHandler.events.StringUpdated({}, (...arr) => {
                this.getContractState();
            });
        }
    }
}

export default Contract;
