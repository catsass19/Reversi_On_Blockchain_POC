import * as React from 'react';
import styled from 'styled-components';
import networkService from '@/service/network';
import appService from '@/service/app';

const Container = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
`;

const StyledInput = styled.input`
    border: none;
    border-bottom: 1px solid #13BF99;
    color: #13BF99;
    background-color: black;
    font-size: xx-large;
    outline: none;
    text-align: center;
    margin: 0px 10px;
    width: 120px;
`;
const StyledButton = styled.button`
    border: none;
    margin-top: 60px;
    padding: 20px;
    background-color: #13BF99;
    color: white;
    font-size: xx-large;
    cursor: pointer;
`;

const Title = styled.div`
    font-size: xx-large;
    text-align: center;
`;
const SubTitle = styled.div`
    text-align: center;
    font-size: large;
    padding: 20px 0px;
`;
const VariableText = styled.span`
    color: white;
`;
const InputRow = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface Props {
    teamName : string;
    teamEnum : number;
}

export default class FundingModal extends React.PureComponent<Props, { shares : number }> {

    public state = {
      shares: 1
    };

    public render() {
        const { teamName } = this.props;
        const { shares } = this.state;
        return (
            <Container>
                <Title>
                    Buy Some shares to fund
                    <VariableText> {teamName} </VariableText>
                </Title>
                <SubTitle>
                    Price per share will <b><VariableText>keep rising</VariableText></b> so don't hestitate to buy it now!
                </SubTitle>
                <InputRow>
                    I'd like to buy
                    <StyledInput
                        type='number'
                        min='1'
                        value={this.state.shares}
                        onChange={this.inputOnchange}
                    />
                    Shares
                    (total cost: <VariableText style={{ margin: '0px 5px' }}>
                        {` ${shares *  Number(networkService.contract.currentSharePrice)} `}
                    </VariableText> DEX)

                </InputRow>
                <StyledButton onClick={this.fund}>
                    Fund {teamName}
                </StyledButton>
            </Container>
        );
    }
    private fund = () => {
      const { teamEnum } = this.props;
      const { shares } = this.state;
      if (shares && networkService.contract) {
        networkService.contract.fund(teamEnum, `${shares}`);
        appService.closeModal();
      }
    }
    private inputOnchange = (e) => {
        this.setState({ shares: e.target.value });
    }

}
