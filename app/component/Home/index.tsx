import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import Dev from '@/component/Dev';
import Header from '@/component/Header';
import Funding from '@/component/Funding';
import Game from '@/component/Game';
import 'react-toastify/dist/ReactToastify.min.css';

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
                <ToastContainer />
                {!networkService.loaded && (
                    'LOADING.....'
                )}
                {networkService.loaded && (
                    <>
                        {dev && <Dev />}
                        {!dev && (
                            <>
                                <Header />
                                {(contract.autoTurn === '0') && <Funding />}
                                {(Number(contract.autoTurn) > 0) && <Game />}
                            </>
                        )}
                    </>
                )}

            </Container>
        );
    }
}

const AppMain = <Home />;

export default AppMain;
