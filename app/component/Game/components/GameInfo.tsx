import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

@observer
export default class GameInfo extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <div>cat team total share: {contract.teamCatFunding}</div>
                <div>dog team total share: {contract.teamDogFunding}</div>
            </Container>
        );
    }
}
