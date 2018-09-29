import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import gameService from '@/service/game';
import Kickoff from './component/Kickoff';
import Turn from './component/Turn';

const Container = styled.div`
    background-color: black;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    color: #13BF99;
    font-size: xx-large;
    text-align: center;
    padding: 20px;
`;

@observer
class Dashboard extends React.Component {
    public render() {
        return(
            <Container>
                <Title>黑白棋大亂鬥</Title>
                {!gameService.start && <Kickoff />}
                {gameService.start && <Turn />}
            </Container>
        );
    }
}

export default Dashboard;
