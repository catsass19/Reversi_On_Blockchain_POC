import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0px 28px;
`;

@observer
export default class ControlHeader extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>
                Game Over. Prize will be distributed to all winners based on share amounts.
                If you are one of the losers you may still get something back by clicking the 'clear game' button
                <button
                    onClick={() => contract.clearGame()}
                >
                    Clear Game
                </button>
                <button
                    onClick={() => contract.startNewGame()}
                >
                    Start new Game
                </button>
            </Container>
        );
    }
}
