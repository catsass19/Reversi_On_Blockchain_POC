import * as React from 'react';
import styled from 'styled-components';
import ReversiBoard from '@/component/ReversiBoard/Lodable';
import Dasboard from '@/component/Dashboard/Loadable';
import Status from '@/component/Status/Loadable';

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const Section = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

class Main extends React.Component {
    public render() {
        return (
            <Container>
                <Section>
                    <ReversiBoard />
                    <Status />
                </Section>
                <Dasboard />

            </Container>
        );
    }
}

const AppMain = <Main />;

export default AppMain;
