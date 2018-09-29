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
`;

const getColor = (type) => {
    switch (type) {
        case gameService.gridStatus.BLACK:
            return 'rgba(0, 0, 0, 1)';
        case gameService.gridStatus.WHITE:
            return 'rgba(255, 255, 255, 0.8)';
        case gameService.gridStatus.AVAILABLE:
            return 'rgba(0, 0, 0, 0.3)';
    }
};

const Grid = ({ item }) => (
    <Wrapper>
        <InnerGrid>
            <Chess
                color={getColor(item)}
            />
        </InnerGrid>
    </Wrapper>
);

export default Grid;
