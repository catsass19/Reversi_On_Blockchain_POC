import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;
const Chess = styled.div`
    height: 40px;
    width: 40px;
    background-color: ${(p) => p.color};
    border: 1px solid white;
    border-radius: 5px;
    margin-right: 20px;
`;
const ResultRow = styled.div`
    display: flex;
    align-items: center;
    font-size: xx-large;
    padding: 20px 0px;
`;
const Padding = styled.div`
    flex: 1;
`;
const WinnerArea = styled.div`
    padding: 15px 0px;
    margin-bottom: 20px;
    text-align: center;
    font-size: xx-large;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

`;
const VariableText = styled.span`
    color: white;
    margin: 20px;
`;
const ClearSection = styled.div`
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 20px;
    padding: 30px 0px;
`;

const StyledButton = styled.button`
    width: 100%;
    padding: 10px 0px;
    border: 1px solid #13BF99;
    background-color: black;
    color: #13BF99;
    cursor: pointer;
    font-size: large;
    &: hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const Hint = styled.div`
    font-size: medium;
    padding: 10px;
`;

@observer
export default class ControlHeader extends React.Component {
    public render() {
        const { contract } = networkService;
        const { blackCount, whiteCount } = contract.getBoardCount;
        return (
            <Container>
                <WinnerArea>
                    <VariableText>
                        {!contract.forceWinner && (
                            contract.getTeamName(this.winnerName())
                        )}
                        {contract.forceWinner && (
                            contract.getTeamName(contract.forceWinner)
                        )}
                    </VariableText>
                    Wins!
                    {contract.forceWinner && (
                        <Hint>
                            because opponent didn't make any proposal at last turn
                        </Hint>
                    )}
                </WinnerArea>
                <ResultRow>
                    <Chess color={'black'} />
                    {contract.getTeamName(contract.black)}
                    <Padding />
                    {blackCount}
                </ResultRow>
                <ResultRow>
                    <Chess color={'white'} />
                    {contract.getTeamName(contract.white)}
                    <Padding />
                    {whiteCount}
                </ResultRow>
                <ClearSection>
                    {contract.inGame && (
                        <StyledButton
                            onClick={() => contract.clearGame()}
                        >
                            Claim Your Prize!
                        </StyledButton>
                    )}
                    {!contract.inGame && (
                        <StyledButton
                            onClick={() => contract.startNewGame()}
                        >
                            Start New Game
                        </StyledButton>
                    )}
                </ClearSection>
                {/* <button
                    onClick={() => contract.updateGame()}
                >
                    updateGame
                </button> */}

                {/* <button
                    onClick={() => contract.startNewGame()}
                >
                    Start new Game
                </button> */}
            </Container>
        );
    }

    private winnerName() {
        const { contract } = networkService;
        const { blackCount, whiteCount } = contract.getBoardCount;
        return (blackCount > whiteCount) ? contract.black : contract.white;
    }
}
