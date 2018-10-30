import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import range from 'lodash/range';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MainText = styled.div`
    display: flex;
`;
const VariableText = styled.div`
    color: white;
    padding: 0px 10px;
`;
const ChessCount = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 20px;
`;
const Chess = styled.div`
    height: 40px;
    width: 40px;
    background-color: ${p => p.color};
    border: 1px solid white;
    border-radius: 5px;
    margin-right: 20px;
`;
const Score = styled.span`
    font-size: xx-large;
`;
const Padding = styled.div`
    flex: 1;
`;
@observer
export default class GameInfo extends React.Component {
    public render() {
        const { contract } = networkService;
        const { blackCount, whiteCount } = contract.getBoardCount;
        return (
            <Container>
                <ChessCount>
                    <Padding />
                    <Padding />
                    <Chess color={'black'}/>
                    <Score>{blackCount}</Score>
                    <Padding />
                    <Chess color={'white'}/>
                    <Score>{whiteCount}</Score>
                    <Padding />
                    <Padding />
                </ChessCount>
                <MainText>
                    You have
                    <VariableText>{contract.userStatus.catShare}</VariableText>
                    shares
                    <VariableText>
                        ({this.getPercentage(contract.userStatus.catShare, contract.teamCatFunding)})
                    </VariableText>
                    of <VariableText>Cat Kōgekitai</VariableText>
                </MainText>
                <MainText>
                    You have
                    <VariableText>{contract.userStatus.dogShare}</VariableText>
                    shares
                    <VariableText>
                        ({this.getPercentage(contract.userStatus.dogShare, contract.teamDogFunding)})
                    </VariableText>
                    of <VariableText>Dog Guerrilla</VariableText>
                </MainText>
                <MainText>
                    If <VariableText>Cat Kōgekitai</VariableText>
                    wins, you get
                    <VariableText>
                        {this.getPrize(
                            contract.userStatus.catShare,
                            contract.teamCatFunding,
                            contract.totalBalance
                        )}
                    </VariableText>
                    DEX
                </MainText>
                <MainText>
                    If <VariableText>Dog Guerrilla</VariableText>
                    wins, you get
                    <VariableText>
                        {this.getPrize(
                            contract.userStatus.dogShare,
                            contract.teamDogFunding,
                            contract.totalBalance
                        )}
                    </VariableText>
                    DEX
                </MainText>
            </Container>
        );
    }
    private getPercentage(a, b) {
        return `${(Number(a) / Number(b)) * 100}%`;
    }
    private getPrize(a, b, c) {
        return Number(c) * (Number(a) / Number(b));
    }
}
