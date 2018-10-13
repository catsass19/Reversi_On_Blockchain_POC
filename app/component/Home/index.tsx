import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import Dev from '@/component/Dev';
import Header from '@/component/Header';
import Funding from '@/component/Funding';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: black;
    color: #13BF99;
`;

@observer
class Home extends React.Component<{}, { dev : boolean }> {

    public state = {
      dev: false,
    };

    public componentDidMount() {
        (window as any).dev = () => {
            this.setState({ dev: !this.state.dev });
        };
    }

    public render() {
        const { contract } = networkService;
        const { dev } = this.state;
        return (
            <Container>
                {!networkService.loaded && (
                    'LOADING.....'
                )}
                {networkService.loaded && (
                    <>
                        {dev && <Dev />}
                        {!dev && (
                            (contract.currentTurn === '0') && <Funding />
                        )}
                    </>
                )}

            </Container>
        );
    }
}

const AppMain = <Home />;

export default AppMain;
