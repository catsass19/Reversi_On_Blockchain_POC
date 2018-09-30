import React from 'react';
import { observer } from 'mobx-react';
import styled, { StyledFunction } from 'styled-components';
import gameService from '@/service/game';
import Grid from './components/grid';

const Wrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
`;

const outline : StyledFunction<{ width : number }> = styled.div;
const BoardOutline = outline`
    border: 2px solid #13BF99;
    border-radius: 2%;
    height: 80%;
    width: ${(p) => p.width || 0}px;
    padding: 1.5%;
    display: flex;
    flex-direction: column;
    background-color: black;
`;
const InnerBoard = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: black;
`;
const Row = styled.div`
    flex: 1;
    display: flex;
`;

@observer
class Board extends React.Component<{}, { width : number }> {

    public state = {
        width: 0,
    };

    private ref;

    public componentDidMount() {
        this.updateSize();
    }

    public render() {
        const { width } = this.state;
        const state = gameService.state;
        const proposed = gameService.proposed;
        return (
            <BoardOutline
                width={width}
                innerRef={ (ref) => this.ref = ref }
            >
                <InnerBoard>
                    {state.map((it, key) => {
                        return (
                            <Row key={key}>
                                {it.map((data, index) => (
                                    <Grid
                                        item={data}
                                        key={index}
                                        y={index}
                                        x={key}
                                        proposed={
                                            (proposed) &&
                                            (proposed.x === key) &&
                                            (proposed.y === index)
                                        }
                                    />
                                ))}
                            </Row>
                        );
                    })}
                </InnerBoard>
            </BoardOutline>
        );
    }

    private updateSize() {
        setTimeout(() => {
            this.setState({ width: this.ref.clientHeight });
        }, 0);

    }
}

const BoardWrapper = () => (
    <Wrapper>
        <Board />
    </Wrapper>
);

export default BoardWrapper;
