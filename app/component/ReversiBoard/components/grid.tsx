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
    background-color: rgba(19, 191, 153, 0.65);
    padding: 1%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background-color: rgba(19, 191, 153, 1);
    }
`;
const Chess : any = styled.div`
    border-radius: 10%;
    height: 80%;
    width: 80%;
    border-radius: 10%;
    ${(p : any) => p.isProposed ? 'border: 1px solid yellow' : ''};
    ${(p : any) => p.hover ? 'border: 3px solid orange' : ''};
    /* ${(p : any) => p.isForecast ? 'border: 3px solid rgba(255, 255, 0, 0.2)' : ''}; */
    background-color: ${(p) => p.color};
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: yellow;
`;

const getColor = (status : string) => {
    const { contract } = networkService;
    switch(status) {
        case contract.GRID_STATUS.BLACK:
            return 'rgba(0, 0, 0, 1)';
        case contract.GRID_STATUS.WHITE:
            return 'rgba(255, 255, 255, 1)';
        case contract.GRID_STATUS.FLIP:
            return 'purple';
        case contract.GRID_STATUS.AVAILABLE:
            return 'rgba(0, 0, 0, 0.2)';
        case contract.GRID_STATUS.EMPTY:
        default:
            return '';
    }
};
const isProposed = (status : string) => {
    const { contract } = networkService;
    return (status === contract.GRID_STATUS.PROPOSED) &&
    (contract.currentTurn === contract.autoTurn);
};

const Grid = ({ x, y, proposal, status, forecast, hover }) => (
    <Wrapper>
        <InnerGrid>
            <Chess
                color={getColor(forecast || status)}
                isProposed={isProposed(status)}
                onClick={() => {
                    const { contract } = networkService;
                    contract.propose(x, y);
                }}
                isForecast={
                    forecast &&
                    (forecast !== networkService.contract.GRID_STATUS.EMPTY)
                }
                hover={hover}
            >
                {proposal && proposal.vote}
            </Chess>
        </InnerGrid>
    </Wrapper>
);

export default Grid;
