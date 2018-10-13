import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import CountDown from '@/component/CountDown';
// import ReversiBoard from '@/component/ReversiBoard/Lodable';
// import Dasboard from '@/component/Dashboard/Loadable';
// import Status from '@/component/Status/Loadable';

const Container = styled.div`
    display: flex;
    height: 100vh;
    padding: 10px;
`;

const Section = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

@observer
class Main extends React.Component {

    public componentDidMount() {

    }

    public render() {
        const { contract } = networkService;
        return (
            <Container>
                {!networkService.loaded && (
                    'LOADING.....'
                )}

                {networkService.loaded && (
                    <div style={{ width: '100%' }}>
                        {networkService.network}
                        {/* <div>Wallet: {networkService.wallet}</div> */}
                        {contract && (
                            <div>
                                {/* Contract Address: {contract.address}
                                <div>currentSize: {contract.currentSize}</div> */}
                                <div>gameRound: {contract.gameRound}</div>
                                <div>fundRaisingPeriod: {contract.fundRaisingPeriod}</div>
                                <div>turnPeriod: {contract.turnPeriod}</div>
                                <div>currentSharePrice: {contract.currentSharePrice}</div>
                                <div>currentSharePerProposal {contract.currentSharePerProposal}</div>
                                <div>fundRaisingCountingDown: {contract.fundRaisingCountingDown ? 'true' : 'false'}</div>
                                <div>current time: <b><CountDown /></b></div>
                                <div>currentTurn: {contract.currentTurn}</div>
                                <div>currentTurnEndTime:<b>{
                                    contract.currentTurnEndTime
                                    ? new Date(contract.currentTurnEndTime * 1000).toLocaleString()
                                    : 'Turn end time not defined'}</b>
                                    - {contract.currentTurnEndTime}
                                </div>
                                {contract.countingStartedTime && (
                                    <>
                                        <div>countingStartedTime:
                                            <b>{(new Date(Number(contract.countingStartedTime) * 1000)).toLocaleString()}</b>
                                            - {contract.countingStartedTime}
                                        </div>
                                        <div>funding end time: <b>{(
                                            new Date(
                                                (Number(contract.countingStartedTime) + Number(contract.fundRaisingPeriod)) * 1000
                                            )).toLocaleString()}</b> </div>
                                    </>
                                )}
                                <div>teamCatFunding: {contract.teamCatFunding}</div>
                                <div>teamDogFunding: {contract.teamDogFunding}</div>
                                {contract.userStatus && (
                                    <>
                                        <div>my team {contract.userStatus.team}</div>
                                        <div>my cat share {contract.userStatus.catShare}</div>
                                        <div>my dog share {contract.userStatus.dogShare}</div>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        const value = prompt('How much do you want to fund for cat?');
                                        if (value) {
                                            contract.fund(contract.TEAM.CAT, value);
                                        }
                                    }}
                                >
                                    fund cat
                                </button>
                                <button
                                    onClick={() => {
                                        const value = prompt('How much do you want to fund for dog?');
                                        if (value) {
                                            contract.fund(contract.TEAM.DOG, value);
                                        }
                                    }}
                                >
                                    fund dog
                                </button>
                                <button
                                    onClick={() => contract.propose()}
                                >
                                    Propose
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {networkService.loaded && (
                    <div style={{ textAlign: 'right', width: '100%' }}>
                        calculated status on UI
                        <div>calculated turn: {contract.autoTurn}</div>
                        <div>
                            <b>{contract.gameResolvedAuto && 'Game is expected to be ended'}</b>
                        </div>
                        <div>current time: <b><CountDown /></b></div>
                        <div>currentTurnEndTime:<b>{
                            contract.autoTurnEndTime
                            ? new Date(contract.autoTurnEndTime * 1000).toLocaleString()
                            : ''}</b>
                        </div>
                        <div>
                            Proposed:
                            {contract.proposed.map((it) => {
                                const id = contract.getProposalId(it.turn, it.proposer);
                                const status = contract.proposalStatus[id];
                                return (
                                    <div key={id} style={{ border: '1px solid #DDD', margin: '3px', padding: '5px' }}>
                                        turn {it.turn} by {it.proposer}
                                        {status && (
                                            <div>vote: {status.vote} @ {status.time}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* <Section>
                    <ReversiBoard />
                    <Status />
                </Section>
                <Dasboard /> */}

            </Container>
        );
    }
}

const AppMain = <Main />;

export default AppMain;
