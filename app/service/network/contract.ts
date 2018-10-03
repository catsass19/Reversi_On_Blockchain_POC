import { observable } from 'mobx';
import { ContractInterface, NetworkInterface, ContractHandlerInterface } from './interface';

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

    @observable public address : string;
    @observable public myString : string;

    private contractHandler : ContractHandlerInterface;
    private contractManifest : ManifestInterface;
    private network : NetworkInterface;

    constructor(network : NetworkInterface) {
        this.network = network;
        this.init();
    }

    public setString(str : string) {
        this.contractHandler
          .methods
          .set(str)
          .send({ from: this.network.wallet })
          .on('confirmation', () => {})
          .on('receipt', (data) => {
              console.log(data);
          });
    }

    private async init() {
        this.contractManifest = (await this.loadManifest()).default;
        this.address = await this.getContractAddress();
        this.contractHandler = this.getContractHandler();
        this.getContractState();

    }

    private loadManifest = () => import('#/Deversi.json');
    private getContractAddress() : string {
        const netId = this.network.netId;
        const infoOnNetwork = this.contractManifest.networks[`${netId}`];
        return infoOnNetwork ? infoOnNetwork.address : '';
    }
    private getContractHandler() {
        const { abi } = this.contractManifest;
        return this.network.getContractHandler(abi, this.address);
    }
    private async getContractState() {
        const myStr = await this.contractHandler.methods.myString().call();
        this.myString = myStr;
        console.log(myStr);
    }
}

export default Contract;
