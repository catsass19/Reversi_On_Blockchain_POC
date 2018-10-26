import React from 'react';
import { observer } from 'mobx-react';
import styled, { StyledFunction } from 'styled-components';
import networkService from '@/service/network';
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
    padding: 15px;
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
        const size = Number(this.props.size);
        const boardIterator = range(Number(size));
        const { contract } = networkService;
        // console.log(contract.flipForecast);
        return (
            <BoardOutline>
                <InnerBoard>
                    {boardIterator.map((iter, key) => {
                        return (
                            <Row key={key}>
                                {boardIterator.map((data, index) => {
                                    const { x, y } = contract.hoverProposal || { x: undefined, y: undefined };
                                    const proposal = contract.proposalStatusArray.find((it) => (
                                        (Number(it.x) === key) &&
                                        (Number(it.y) === index) &&
                                        (it.turn === contract.autoTurn)
                                    ));
                                    const forecast = contract.flipForecast[`${key}${index}`];
                                    const hover = (x === key) && (y === index);
                                    return (
                                        <Grid
                                            key={index}
                                            y={index}
                                            x={key}
                                            status={
                                                contract.boardStatus &&
                                                contract.boardStatus.length &&
                                                (contract.boardStatus[(size * key) + index])
                                            }
                                            proposal={proposal}
                                            forecast={forecast}
                                            hover={hover}
                                        />
                                    );
                                })}
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
