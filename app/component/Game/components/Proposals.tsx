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

const Hint = styled.div`
    font-size: small;
    margin-bottom: 20px;
`;
const Items = styled.div`
    margin: 5px 0px;
    color: rgba(255, 255, 255, 0.5);
`;
@observer
export default class Proposals extends React.Component {
    public render() {
        const { contract } = networkService;
        const forecastTeam = contract.forecastCurrentTeam;
        const proposals = contract.proposed.filter((it) => it.turn === contract.autoTurn);
        // const proposals = contract.proposed;
        return (
            <Container>
                <Line />
                <Hint>
                    <Items>
                        - Members of Team
                        <span style={{ color: 'white', margin: '0px 5px' }}>{contract.getTeamName(forecastTeam)}</span>
                        is now able to propose
                    </Items>
                    <Items>
                        - The proposal which receives the most votes will be selected as the next step<br/>
                    </Items>
                    <Items>
                        - Anyone (with or without a team) is able to vote on the proposals
                    </Items>
                    <Items>
                        - 1 vote costs 1 share and 1 proposal costs 10 shares
                    </Items>
                    <Items>
                        - You may vote as many times as you like
                    </Items>
                </Hint>
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
