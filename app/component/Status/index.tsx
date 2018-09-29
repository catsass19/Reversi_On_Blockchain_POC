import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import kim from '@/assets/kim.svg';
import trump from '@/assets/trump.svg';
import gameService from '@/service/game';

const StyledImg = styled.img`
    height: 30px;
`;

const Container = styled.div`
    background-color: black;
    height: 200px;
    display: flex;
    flex-direction: column;
    color: #13BF99;
    justify-content: center;
    align-items: center;
`;

const Row = styled.div`
    display: flex;
    padding: 5px;
    align-items: center;
`;
const Fund = styled.span`
    margin: 0px 15px 0px 5px;
`;

@observer
class Status extends React.Component {
    public render() {
        return(
            <Container>
                {gameService.myTeam && (
                    <>
                        <Row>
                            <StyledImg src={trump} />
                            <Fund>{gameService.trumpKickoffFund}</Fund>
                            <StyledImg src={kim} />
                            <Fund>{gameService.kimKickoffFund}</Fund>
                        </Row>
                        <Row>您隸屬於Team Kim, 目前投入的總金額為4300個Dexon</Row>
                        <Row>若Team Kim獲勝, 您將可獲得總獎金的8.7%, 大約是9487個Dexon</Row>
                    </>
                )}



        </Container>
        );
    }
}

export default Status;
