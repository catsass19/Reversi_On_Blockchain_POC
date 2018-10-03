import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
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
        const { contract } = networkService;
        return (
            <Container>
                {!networkService.loaded && (
                    'LOADING.....'
                )}

                {networkService.loaded && (
                    <div>
                        {networkService.network}
                        <div>Wallet: {networkService.wallet}</div>
                        {contract && (
                            <div>
                                Contract Address: {contract.address}
                                <button
                                    onClick={() => {
                                        contract.setString('123');
                                    }}
                                >
                                    set string
                                </button>
                            </div>
                        )}
                    </div>
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
