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

    @observable public currentSize : string;
    @observable public fundRaisingPeriod : string;
    @observable public turnPeriod : string;
    @observable public currentSharePrice : string;
    @observable public fundRaisingCountingDown : boolean;

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
            const [
                currentSize,
                fundRaisingPeriod,
                turnPeriod,
                currentSharePrice,
                fundRaisingCountingDown,
            ] = await Promise.all([
                this.contractHandler.methods.currentSize().call(),
                this.contractHandler.methods.fundRaisingPeriod().call(),
                this.contractHandler.methods.turnPeriod().call(),
                this.contractHandler.methods.currentSharePrice().call(),
                this.contractHandler.methods.fundRaisingCountingDown().call(),
            ]);
            runInAction(() => {
                this.myString = myStr;
                this.currentSize = currentSize;
                this.fundRaisingPeriod = fundRaisingPeriod;
                this.turnPeriod = turnPeriod;
                this.currentSharePrice = currentSharePrice;
                this.fundRaisingCountingDown = fundRaisingCountingDown;
            });
        }
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
