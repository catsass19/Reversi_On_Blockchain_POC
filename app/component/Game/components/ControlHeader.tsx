import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import CountDown from '@/component/CountDown';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const DescrptionText = styled.span``;
const VariableText = styled.span`

    color: white;
`;
const Item = styled.div`
    padding: 10px 0px;
    font-size: xx-large;
    display: flex;
    align-items: center;
`;
const Padding = styled.div`
    flex: 1;
`;
const Time = styled.div`
    font-size: large;
    color: white;
`;
const Color = styled.div`
    background-color: ${(p) => p.color};
    height: 40px;
    width: 40px;
    border-radius: 5px;
    border: 1px solid white;
    margin-right: 10px;
`;
const TimeText = styled.span`
    font-size: large;
    color: gray;
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
                            <Item>
                                <Color color={contract.forecastCurrentTeamColor} />
                                <VariableText>{contract.getTeamName(forecastTeam)}</VariableText>
                                <DescrptionText>'s turn</DescrptionText>
                            </Item>
                            <Padding />
                            {contract.autoTurnEndTime && (
                                <Item>
                                    <Padding />
                                    <TimeText>
                                        Current Turn Ends
                                    </TimeText>
                                    <Time>
                                        <CountDown time={contract.autoTurnEndTime} />
                                    </Time>
                                </Item>
                            )}
                        </>
                    )}

                    {/* {contract.gameResolvedAuto && (
                        <Item>
                            <DescrptionText>Game Over</DescrptionText>
                        </Item>
                    )} */}
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
