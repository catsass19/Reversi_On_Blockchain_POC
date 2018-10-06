interface Variable<T> {
    call : () => T;
}
interface Method {
    send : (param : { from : string }) => any;
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
  myString : () => Variable<string>;
  set : (str : string) => Method;
  currentSize : () => Variable<string>;
  fundRaisingPeriod : () => Variable<string>;
  turnPeriod : () => Variable<string>;
  currentSharePrice : () => Variable<string>;
  fundRaisingCountingDown : () => Variable<boolean>;
}

interface ContractEvents {
    StringUpdated : EventSubscriber;
    NewGameStarted : EventSubscriber;
}

export interface HandlerInterface {
    methods : ContractMethods;
    events : ContractEvents;
}

export interface ContractInterface {
    address : string;
    myString : string;
    setString : (str : string) => void;
}

export interface NetworkInterface {
    loaded : boolean;
    wallet : string;
    network : string;
    contract : ContractInterface;
    netId : number;
    getContractHandler : (abi : Array<any>, addr : string) => any;
    getWalletHandler : (abi : Array<any>, addr : string) => any;
}
