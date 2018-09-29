import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import gameService from '@/service/game';
import Kickoff from './component/Kickoff';

const Container = styled.div`
    border-left: 1px solid #13BF99;
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
const Dashboard = () => (
    <Container>
        <Title>黑白棋大亂鬥</Title>
        {!gameService.start && <Kickoff />}
    </Container>
);

export default Dashboard;
