interface Variable<T> {
    call : () => T;
}
interface Method {
    send : (param : { from : string }) => any;
}

interface ContractMethods {
    myString : () => Variable<string>;
    set : (str : string) => Method;
}

export interface ContractHandlerInterface {
    methods : ContractMethods;
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
}
