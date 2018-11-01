import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react';
import styled, { keyframes } from 'styled-components';
import networkService from '@/service/network';
import Dev from '@/component/Dev';
import Header from '@/component/Header';
import Funding from '@/component/Funding';
import Game from '@/component/Game';
import 'react-toastify/dist/ReactToastify.min.css';
import appService from '@/service/app';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: black;
    color: #13BF99;
`;

const ModalBackground = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalEffect = keyframes`
    from {
        opacity: 0;
        margin-top: 20vh;
    }
    to {
        opacity: 1;
        margin-top: 0;
    }
`;

const ModalInner = styled.div`
    padding: 20px;
    border: 1px solid #13BF99;
    animation: ${ModalEffect} 0.3s ease-in;
    background-color: black;
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
                {appService.isModalOpen && (
                    <ModalBackground onClick={appService.closeModal}>
                        <ModalInner onClick={(e) => e.stopPropagation() }>
                            {appService.mountedModal}
                        </ModalInner>
                    </ModalBackground>
                )}
            </Container>
        );
    }
}

const AppMain = <Home />;

export default AppMain;
