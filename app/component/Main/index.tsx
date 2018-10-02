import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import contractService from '@/service/contract';
// import ReversiBoard from '@/component/ReversiBoard/Lodable';
// import Dasboard from '@/component/Dashboard/Loadable';
// import Status from '@/component/Status/Loadable';

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const Section = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

@observer
class Main extends React.Component {

    public componentDidMount() {

    }

    public render() {
        return (
            <Container>
                {!contractService.loaded && (
                    'LOADING.....'
                )}

                {contractService.loaded && (
                    'Loaded!!!!!'
                )}
                {/* <Section>
                    <ReversiBoard />
                    <Status />
                </Section>
                <Dasboard /> */}

            </Container>
        );
    }
}

const AppMain = <Main />;

export default AppMain;
