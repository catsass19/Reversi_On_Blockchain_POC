import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import DisplayItem from '@/component/DisplayItem';
import deversi from '@/assets/deversi.svg';

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 30px;
`;
const WhiteText = styled.span`
    color: #CCC;
`;
const Logo = styled.img`
    height: 40px;
    margin: 20px 0px;
`;
const Title = styled.div`
    font-size: 40px;
    margin: 0px 20px;
`;
const Padding = styled.div`
    flex: 1;
`;
@observer
export default class Header extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <Logo src={deversi} />
                <Title>
                    <WhiteText>De</WhiteText>
                    versi
                </Title>
                <Padding />
                <DisplayItem
                    title='Share Price'
                    amount={contract.currentSharePrice}
                    unit={'DEX'}
                />
                {contract.myTeam && (
                    <DisplayItem
                        title='My Team'
                        amount={contract.myTeam}
                    />
                )}

            </Container>
        );
    }
}
