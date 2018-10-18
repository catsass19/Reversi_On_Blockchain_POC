import React from 'react';
import styled from 'styled-components';
import networkService from '@/service/network';

const Wrapper  = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2px;
`;
const InnerGrid = styled.div`
    flex: 1;
    border-radius: 3%;
    background-color: rgba(19, 191, 153, 0.7);
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

const getColor = (status : string) => {
    const { contract } = networkService;
    switch(status) {
        case contract.GRID_STATUS.BLACK:
            return 'rgba(0, 0, 0, 1)';
        case contract.GRID_STATUS.WHITE:
            return 'rgba(255, 255, 255, 1)';
        case contract.GRID_STATUS.AVAILABLE:
            return 'green';
        case contract.GRID_STATUS.PROPOSED:
            return 'red';
        case contract.GRID_STATUS.EMPTY:
        default:
            return '';
    }
}

const Grid = ({ x, y, proposed, status }) => (
    <Wrapper>
        {(() => console.log(status))()}
        <InnerGrid>
            <Chess
                color={getColor(status)}
                onClick={() => {
                    const { contract } = networkService;
                    contract.propose();
                }}
            />
        </InnerGrid>
    </Wrapper>
);

export default Grid;
