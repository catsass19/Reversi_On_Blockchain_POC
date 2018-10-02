import { observable } from 'mobx';

class Contract {

  @observable public loaded : boolean = false;
  @observable public wallet : string;

  private blockchainHandler;
  private contractBinary;
  private contractHandler;

  constructor() {
      this.loadResource();
  }

  private loadResource = async () => {
      const [
        blockchainHandler,
        contractBinary,
      ] = await Promise.all([
        import(/* webpackChunkName: "web3" */'web3'),
        require('#/Deversi.json'),
      ]);
      this.loaded = true;
      this.blockchainHandler = new blockchainHandler.default((window as any).web3.currentProvider);
      this.contractBinary = contractBinary;
      console.log(this.contractBinary);
      this.connect();
  }

  private connect = async () => {
      const [
          walletAddr,
      ] = await Promise.all([
          this.getWalletAddress(),
      ]);
      console.log('addr', walletAddr);
  }

  private getWalletAddress = async () => {
    const addr = await this.blockchainHandler.eth.getAccounts();
    return addr[0];
  }
}

const contractService = new Contract();

export default contractService;
