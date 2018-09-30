import React from 'react';
import styled from 'styled-components';
import gameService from '@/service/game';

const Wrapper  = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1%;
`;
const InnerGrid = styled.div`
    flex: 1;
    border-radius: 3%;
    background-color: #13BF99;
    padding: 1%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background-color: #1cffcc;
    }
`;
const Chess = styled.div`
    border-radius: 10%;
    height: 80%;
    width: 80%;
    border-radius: 5%;
    background-color: ${(p) => p.color};
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
`;

const getColor = (type, proposed) => {
    if (proposed) {
        return 'rgba(255, 215, 0, 0.5)';
    }
    switch (type) {
        case gameService.gridStatus.BLACK:
            return 'rgba(0, 0, 0, 1)';
        case gameService.gridStatus.WHITE:
            return 'rgba(255, 255, 255, 0.8)';
        case gameService.gridStatus.AVAILABLE:
            return 'rgba(0, 0, 0, 0.3)';
        case gameService.gridStatus.PROPOSED:
            return 'rgba(255, 215, 0, 0.5)';
    }
};

const Grid = ({ item, x, y, proposed }) => (
    <Wrapper>
        <InnerGrid>
            <Chess
                color={getColor(item, proposed)}
                onClick={() => {
                    if (item === gameService.gridStatus.AVAILABLE) {
                        confirm('您確定要提案並且支付1234個Dexon嗎?');
                        gameService.propose(x, y);
                    }
                    if (item === gameService.gridStatus.PROPOSED) {
                        confirm('您確定要投此提案一票嗎?');
                    }
                }}
            >
                {(proposed || (item === gameService.gridStatus.PROPOSED)) && (
                    <>
                        {proposed && '3'}
                        {(x === 3) && (y === 1) && ('1')}
                        {(x === 4) && (y === 2) && ('2')}
                    </>
                )}
            </Chess>
        </InnerGrid>
    </Wrapper>
);

export default Grid;
