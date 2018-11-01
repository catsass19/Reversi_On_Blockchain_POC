import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import appService from '@/service/app';
import VoteModal from './VoteModal';
const Container = styled.div`
    flex: 1;
    overflow-y: auto;
`;

const Proposal = styled.div`
    display: flex;
    padding: 20px;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: larger;
    margin-top: 10px;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;

const Padding = styled.div`
    flex: 1;
`;

const Vote = styled.div`
    cursor: pointer;
    &:hover {
        font-weight: bold;
    }
`;

const Line = styled.hr`
    margin: 20px 0px;
    border: 1px solid rgba(255 ,255, 255, 0.2);
`;

@observer
export default class Proposals extends React.Component {
    public render() {
        const { contract } = networkService;
        const proposals = contract.proposed.filter((it) => it.turn === contract.autoTurn);
        // const proposals = contract.proposed;
        return (
            <Container>
                <Line />
                {(proposals.length > 0) && (
                    <div>{proposals.length} Proposals:</div>
                )}
                {proposals.map((it) => {
                    // console.log(it);
                    const id = contract.getProposalId(it.turn, it.proposer);
                    const status = contract.proposalStatus[id];
                    return (
                        <Proposal
                            key={id}
                            onMouseEnter={() => contract.setHoverProposal(it.x, it.y)}
                            onMouseLeave={() => contract.clearHoverProposal()}
                        >
                            {/* turn: {it.turn} */}
                            {status && (
                                <div>{status.vote} Shares</div>
                            )}
                            {(it.proposer === networkService.wallet) && (
                                <div style={{ margin: '0px 20px' }} >(Your proposal)</div>
                            )}
                            <Padding />
                            <Vote
                                onClick={() => {
                                    appService.openModal(
                                        <VoteModal
                                            round={it.round}
                                            turn={it.turn}
                                            proposer={it.proposer}
                                        />
                                    );
                                }}
                            >
                                Vote
                            </Vote>
                        </Proposal>
                    );
                })}
            </Container>
        );
    }
}
