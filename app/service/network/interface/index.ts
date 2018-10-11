interface Variable<T> {
    call : () => T;
}
interface Method {
    send : (param : { from : string, value? : string }) => any;
}

type EventSubscriber = (
    options : {
        filter? : any,
        fromBlock? : number,
        topics?  : Array<any>,
    },
    callback : () => void,
) => void;

interface ContractMethods {
  currentSize : () => Variable<string>;
  fundRaisingPeriod : () => Variable<string>;
  gameRound : () => Variable<string>;
  turnPeriod : () => Variable<string>;
  currentSharePrice : () => Variable<string>;
  currentSharePerProposal : () => Variable<string>;
  fundRaisingCountingDown : () => Variable<boolean>;
  countingStartedTime : () => Variable<string>;
  funding : (team : number, amount : string) => Method;
  getTeamFundingStatus : () => Variable<[string, string]>;
  getUserStatus : (addr : string) => Variable<[boolean, string, string, string]>;
  currentTurn : () => Variable<string>;
}

interface ContractEvents {
    funded : EventSubscriber;
    NewGameStarted : EventSubscriber;
    fundRaisingCountdown : EventSubscriber;
    turnStart : EventSubscriber;
}

export interface HandlerInterface {
    methods : ContractMethods;
    events : ContractEvents;
}

export interface ContractInterface {
    address : string;
}

export interface NetworkInterface {
    web3 : any;
    loaded : boolean;
    wallet : string;
    network : string;
    contract : ContractInterface;
    netId : number;
    getContractHandler : (abi : Array<any>, addr : string) => any;
    getWalletHandler : (abi : Array<any>, addr : string) => any;
}
