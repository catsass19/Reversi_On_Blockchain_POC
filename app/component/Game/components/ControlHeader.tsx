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
    margin: 15px;
    color: white;
`;
const Item = styled.div`
    padding: 10px 0px;
    font-size: xx-large;
`;
const Padding = styled.div`
    flex: 1;
`;
@observer
export default class ControlHeader extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <>
                <Container>
                    {!contract.gameResolvedAuto && (
                        <>
                          <Item>
                              <DescrptionText>Turn</DescrptionText>
                              <VariableText>{contract.autoTurn}</VariableText>

                          </Item>
                          <Padding />
                          {contract.autoTurnEndTime && (
                            <Item>
                                <VariableText>
                                    <CountDown time={contract.autoTurnEndTime} />
                                </VariableText>
                                <DescrptionText>Seconds Remaining </DescrptionText>
                            </Item>
                          )}
                        </>
                    )}

                    {contract.gameResolvedAuto && (
                        <Item>
                            <DescrptionText>Game</DescrptionText>
                            <VariableText>{contract.gameRound}</VariableText>
                            <DescrptionText>is Ended</DescrptionText>
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
