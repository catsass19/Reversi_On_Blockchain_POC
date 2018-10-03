interface Var {
    call : () => void;
}
interface Method {
    send : (param : { from : string }) => any;
}

export interface ContractMethods {
    myString : () => Var;
    set : (str : string) => Method;
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
