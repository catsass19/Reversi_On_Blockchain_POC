import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import deversi from '@/assets/deversi.svg';
import cat from '@/assets/cat.svg';
import dog from '@/assets/dog.svg';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Section = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;
const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 0px 30px;
`;
const Logo = styled.img`
    height: 40px;
`;
const Title = styled.div`
    font-size: 40px;
    margin: 20px;
`;
const Profile : any = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: ${(p : any) => p.isSelected ? '1' : '0.9'};
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
    font-size: larger;
`;

const Versus = styled.div`
    font-size: 80px;
    text-align: center;
`;
const TeamArea = styled.div`
    display: flex;
    align-items: center;
`;
const Padding = styled.div`
    flex: 1;
`;
const Check = styled.span`
    margin: 0px 10px;
    font-size: 50px;
`;
@observer
export default class Funding extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <Section>
                    <Header>
                        <Logo src={deversi} />
                        <Title>Deversi</Title>
                    </Header>
                    <Padding />
                </Section>
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
                        <TeamName>Dog Guerrilla</TeamName>
                        <TeamFund>received {contract.teamDogFunding} shares</TeamFund>
                        {(contract.userStatus.team === `${contract.TEAM.DOG}`) && <Check>✓</Check>}
                    </Profile>
                </TeamArea>
                <Section />
            </Container>
        );
    }

    private fund(teamName : string, teamEnum : number) {
        const value = prompt(`How much DEX do you want to invest in ${teamName}?`);
        if (value && networkService.contract) {
          networkService.contract.fund(teamEnum, value);
      }
    }
}
