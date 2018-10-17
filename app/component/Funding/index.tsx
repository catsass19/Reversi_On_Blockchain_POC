import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import cat from '@/assets/cat.svg';
import dog from '@/assets/dog.svg';
import CountDown from '@/component/CountDown';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;
const CountDownStyle = styled.div`
    color: white;
    margin: 0px 20px;
`;
const Section = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Profile : any = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
`;
const TeamLogo = styled.img`
    height: 300px;
`;
const TeamName = styled.div`
    font-size: 40px;
    margin-top: 40px;
`;
const TeamFund = styled.div`
    font-size: 25px;
`;

const Versus = styled.div`
    font-size: 80px;
    text-align: center;
`;
const TeamArea = styled.div`
    display: flex;
    align-items: center;
    margin-top: 120px;
`;
const Check = styled.span`
    margin: 0px 10px;
    font-size: 50px;
`;
const CountDownText = styled.div`
    font-size: 50px;
    display: flex;
`;
@observer
export default class Funding extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <TeamArea>
                    <Profile
                        onClick={() => this.fund('Cat Kōgekitai', contract.TEAM.CAT)}
                        isSelected={contract.userStatus.team === `${contract.TEAM.CAT}`}
                    >
                        <TeamLogo src={cat} />
                        <TeamName>
                            Cat Kōgekitai
                            {(contract.userStatus.team === `${contract.TEAM.CAT}`) && <Check>✓</Check>}
                        </TeamName>
                        <TeamFund>received {contract.teamCatFunding} shares</TeamFund>
                    </Profile>
                    <Versus>VS</Versus>
                    <Profile
                        onClick={() => this.fund('Dog Guerrilla', contract.TEAM.DOG)}
                        isSelected={contract.userStatus.team === `${contract.TEAM.DOG}`}
                    >
                        <TeamLogo src={dog} />
                        <TeamName>
                            Dog Guerrilla
                            {(contract.userStatus.team === `${contract.TEAM.DOG}`) && <Check>✓</Check>}
                        </TeamName>
                        <TeamFund>received {contract.teamDogFunding} shares</TeamFund>
                    </Profile>
                </TeamArea>
                <Section>
                    {(contract.fundRaisingCountingDown) && (
                        <CountDownText>Game Starts In
                            <CountDownStyle>
                                <CountDown
                                    time={Number(contract.countingStartedTime) + Number(contract.fundRaisingPeriod)}
                                />
                            </CountDownStyle>
                            Seconds
                        </CountDownText>
                    )}
                </Section>
            </Container>
        );
    }

    private fund(teamName : string, teamEnum : number) {
        const shares = prompt(`How much Shares do you want to invest in ${teamName}?`);
        if (shares && networkService.contract) {
          networkService.contract.fund(teamEnum, shares);
      }
    }
}
