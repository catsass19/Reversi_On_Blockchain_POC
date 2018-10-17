import React from 'react';
import styled from 'styled-components';
import networkService from '@/service/network';

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

const Grid = ({ x, y, proposed }) => (
    <Wrapper>
        <InnerGrid>
            <Chess
                color={''}
                onClick={() => {
                    const { contract } = networkService;
                    contract.propose();
                }}
            />
        </InnerGrid>
    </Wrapper>
);

export default Grid;
