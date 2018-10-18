import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Board from '@/component/ReversiBoard';
import networkService from '@/service/network';
import ControlHeader from './components/ControlHeader';
import Proposals from './components/Proposals';
import GameOver from './components/GameOver';

const Container = styled.div`
    flex: 1;
    display: flex;
    padding: 0px 28px;
`;
const BoardArea = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0px;
`;
const GameInfo = styled.div`
    /* border: 1px solid red; */
    flex: 1;
`;
const ControlArea = styled.div`
    /* border: 1px solid red; */
    flex: 1;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
`;
@observer
export default class Game extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <BoardArea>
                    <div>
                        <Board size={contract.currentSize} />
                    </div>
                    <GameInfo>
                        sdf
                    </GameInfo>
                </BoardArea>
                <ControlArea>
                    <ControlHeader />
                    <Proposals />
                    {!contract.gameResolvedAuto && (<Proposals />)}
                    {contract.gameResolvedAuto && (<GameOver />)}
                </ControlArea>
            </Container>
        );
    }
}
