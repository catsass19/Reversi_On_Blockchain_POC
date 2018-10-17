import React from 'react';
import { observer } from 'mobx-react';
import styled, { StyledFunction } from 'styled-components';
import range from 'lodash/range';
import Grid from './components/grid';

const Wrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
`;

const BoardOutline = styled.div`
    border: 2px solid #13BF99;
    border-radius: 2%;
    width: 550px;
    height: 550px;
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
class Board extends React.Component<{ size : string | number }> {

    public render() {
        const { size } = this.props;
        const boardIterator = range(Number(size));
        return (
            <BoardOutline>
                <InnerBoard>
                    {boardIterator.map((it, key) => {
                        return (
                            <Row key={key}>
                                {boardIterator.map((data, index) => (
                                    <Grid
                                        key={index}
                                        y={index}
                                        x={key}
                                        proposed={false}
                                    />
                                ))}
                            </Row>
                        );
                    })}
                </InnerBoard>
            </BoardOutline>
        );
    }
}

const BoardWrapper = ({ size }) => (
    <Wrapper>
        <Board size={size} />
    </Wrapper>
);

export default BoardWrapper;
