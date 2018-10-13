import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
`;
const Title = styled.span`
  font-size: xx-large;
`;

@observer
export default class Header extends React.Component {
    public render() {
        const { contract } = networkService;
        return (
            <Container>

            </Container>
        );
    }
}
