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
const Row = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`;
const TeamBox = styled.div`
    border: 1px solid black;
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        border-bottom: 1px solid #13BF99;
    }
`;
const VS = styled.div`
    padding: 20px;
    font-size: xx-large;
`;
const ImgWrapper = styled.div`
    flex: 1;
`;
const TeamImg = styled.img`
    height: 200px;
`;
const Text = styled.div`
    font-size: xx-large;
    text-align: center;
    text-align: center;
`;
const FundRaising = styled.div``;
const Fund = styled.span`
    margin: 0px 5px;
`;
const Description = styled.div`
    padding: 20px;
    font-size: large;
    text-align: center;
`;

@observer
export default class Kickoff extends React.Component {
    public render() {
        return (
            <Wrapper>
                <Row>
                    <TeamBox>
                        <ImgWrapper>
                            <TeamImg src={trump} />
                        </ImgWrapper>
                        <Text>Team Trump</Text>
                        <FundRaising>已獲得<Fund>{gameService.trumpKickoffFund}</Fund>個Dexon</FundRaising>
                    </TeamBox>
                    <VS>VS</VS>
                    <TeamBox
                        onClick={this.chooseTeam}
                    >
                        <ImgWrapper>
                            <TeamImg src={kim} />
                        </ImgWrapper>
                        <Text>Team Kim</Text>
                        <FundRaising>已獲得<Fund>{gameService.kimKickoffFund}</Fund>個Dexon</FundRaising>
                    </TeamBox>
                </Row>
                <Description>
                    <div>選擇你的隊伍並且下注, 下注的金額越多分到的獎金越多!</div>
                    <div>在現階段獲得較多資金的隊伍將獲得先手的機會</div>
                    <div>比賽將於1個小時後開始</div>
                </Description>
            </Wrapper>
        );
    }
    private chooseTeam = () => {
        const fund = prompt('請問你要下注多少給team Kim?');
        alert('我是metamask, 請confirm transaction');
        gameService.setTeam(false);
    }
}
