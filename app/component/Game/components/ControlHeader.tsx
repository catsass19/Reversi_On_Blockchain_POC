import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import CountDown from '@/component/CountDown';

const Container = styled.div`
    display: flex;
    align-items: center;
`;
const DescrptionText = styled.span``;
const VariableText = styled.span`

    color: white;
`;
const Item = styled.div`
    padding: 10px 0px;
    font-size: xx-large;
`;
const Padding = styled.div`
    flex: 1;
`;
const Color = styled.div`
    background-color: ${(p) => p.color};
    height: 40px;
    width: 40px;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-right: 10px;
`;
@observer
export default class ControlHeader extends React.Component {
    public render() {
        const { contract } = networkService;
        const forecastTeam = contract.forecastCurrentTeam;
        return (
            <>
                <Container>
                    {!contract.gameResolvedAuto && (
                        <>
                            <Color color={contract.forecastCurrentTeamColor} />
                            <Item>
                                <VariableText>{contract.getTeamName(forecastTeam)}</VariableText>
                                <DescrptionText>'s turn</DescrptionText>
                            </Item>
                            <Padding />
                            {contract.autoTurnEndTime && (
                                <Item>
                                    <VariableText>
                                        <CountDown time={contract.autoTurnEndTime} />
                                    </VariableText>
                                </Item>
                            )}
                        </>
                    )}

                    {contract.gameResolvedAuto && (
                        <Item>
                            <DescrptionText>Game Over</DescrptionText>
                            {/* <VariableText>{contract.gameRound}</VariableText>
                            <DescrptionText>is Ended</DescrptionText> */}
                        </Item>
                    )}
                  </Container>
                  {/* <Container>
                      <Item>
                          <DescrptionText>Current Player</DescrptionText>
                          <VariableText>{contract.currentTeamName}</VariableText>
                      </Item>
                  </Container> */}

            </>
        );
    }
}
