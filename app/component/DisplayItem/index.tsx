import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    text-align: right;
    margin:0px 20px;
`;
const Title = styled.div`
    font-size: large;
`;
const Amount = styled.span`
    color: white;
`;
const Content = styled.div``;
const Unit = styled.span`
    margin-left: 5px;
`;

interface Props {
    title? : string;
    amount? : string | number;
    unit? : string;
}

export default class DisplayItem extends React.PureComponent<Props> {
    public render() {
        const { title, amount, unit } = this.props;
        return (
            <Container>
                <Title>{title} </Title>
                <Content>
                    <Amount>{amount}</Amount>
                    <Unit>{unit}</Unit>
                </Content>
            </Container>
        );
    }
}
