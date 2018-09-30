import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import kim from '@/assets/kim.svg';
import trump from '@/assets/trump.svg';
import gameService from '@/service/game';

const Wrapper = styled.div`
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #13BF99;
`;

const Title = styled.div`
    font-size: large;
`;

const Proposal = styled.div`
    border: 1px solid #13BF99;
    display: flex;
    align-items: center;
    padding: 20px;
    margin-top: 20px;
`;
const Rank = styled.span`
    font-size: large;
    font-weight: bold;
`;
const Fund = styled.span`
    flex: 1;
    text-align: center;
`;
const Btn = styled.div`
    cursor: pointer;
    &:hover {
        color: #1cffcc;
    }
`;
const StyledImg = styled.img`
    height: 150px;
`;
const Text = styled.div`
    text-align: center;
    font-size: xx-large;
`;
const Padding = styled.div`
    flex: 1;
`;
const Small = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;
@observer
export default class Turn extends React.Component {

    public render() {
        return (
            <Wrapper>
                <Title>目前的提案</Title>
                {this.renderProposal(1, 'rank1Fund')}
                {this.renderProposal(2, 'rank2Fund')}
                {gameService.proposed && (
                    this.renderProposal(3, 'rank3Fund')
                )}
                <Padding />
                <StyledImg src={kim} />
                <Text>Team Kim 的回合!</Text>
                <Small>本回合還剩下 1 個小時 36 分鐘 {gameService.second} 秒</Small>
            </Wrapper>
        );
    }

    private renderProposal(rank, fund) {
        return (
            <Proposal>
                <Rank>{rank}</Rank>
                <Fund>已獲得<span style={{ margin: '5px' }}>{gameService[fund]}</span>個Dexon</Fund>
                <Btn
                    onClick={() => {
                        confirm(`您確定要投此提案一票嗎?`);
                    }}
                >投票</Btn>
            </Proposal>
        );
    }
}
