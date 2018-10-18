interface Variable<T> {
    call : () => Promise<T>;
}
interface Method {
    send : (param : { from : string, value? : string }) => any;
}

type EventSubscriber<T> = (
    options : {
        filter? : any,
        fromBlock? : number,
        topics?  : Array<any>,
    },
    callback : (
        y : null,
        params : {
            returnValues : T
        }
    ) => void,
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
    getProposalStatus : (
        round : string, turn : string, addr : string
    ) => Variable<{ vote : string, time : string, x : string, y : string }>;
    currentTurn : () => Variable<string>;
    currentTeam : () => Variable<string>;
    startNewGame : () => Method;
    clearGame : () => Method;
    vote : () => Method;
    getBoardStatus : () => Variable<Array<string>>;
}

interface ContractEvents {
    funded : EventSubscriber<any>;
    NewGameStarted : EventSubscriber<any>;
    fundRaisingCountdown : EventSubscriber<any>;
    turnStart : EventSubscriber<any>;
    proposed : EventSubscriber<{ round : string, turn : string, proposer : string, x : string, y : string }>;
    gameCleared : EventSubscriber<{ round : string, clearer : string }>;
    voted : EventSubscriber<any>;
}

export interface HandlerInterface {
    methods : ContractMethods;
    events : ContractEvents;
    getPastEvents : <T>(
        eventName : string,
        options? : {
            filter : any,
            fromBlock : number,
            toBlock : number | string,
        },
    ) => Promise<Array<{ returnValues : T }>>;
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
