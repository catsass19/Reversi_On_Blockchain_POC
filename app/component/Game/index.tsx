import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Board from '@/component/ReversiBoard';
import networkService from '@/service/network';
import appService from '@/service/app';
import ControlHeader from './components/ControlHeader';
import Proposals from './components/Proposals';
import GameOver from './components/GameOver';
import GameInfo from './components/GameInfo';
import Messages from './components/Messages';

const Container = styled.div`
    flex: 1;
    display: flex;
    padding: 0px 10px;
`;
const BoardArea = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0px;
`;

const ControlArea = styled.div`
    /* border: 1px solid red; */
    flex: 1;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
`;

const ChatArea = styled.div`
    /* border-left: 1px solid rgba(255, 255, 255, 0.5); */
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
`;
const Title = styled.div`
    padding: 15px;
    font-size: xx-large;
    text-align: right;
`;
const StyledInput = styled.input`
    flex: 1;
    outline: none;
    height: 40px;
    color: #13BF99;
    border: none;
    border-bottom: 1px solid #13BF99;
    background-color: black;
    font-size: larger;
`;
const StyledButton = styled.button`
    margin-left: 15px;
    outline: none;
    height: 40px;
    padding: 0px 20px;
    border: 1px solid #13BF99;
    color: #13BF99;
    font-size: 20px;
    background-color: black;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
const InputArea = styled.div`
    display: flex;
    align-items: center;
    padding-top: 10px;
`;

const ChatLogo = styled.div`
    border: 1px solid red;
    display: flex;
    flex-direction: column;
`;

@observer
export default class Game extends React.Component {

    public state = {
        input: '',
    };

    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <BoardArea>
                    <div>
                        <Board size={contract.currentSize} />
                    </div>
                    <GameInfo />
                </BoardArea>
                <ControlArea>
                    <ControlHeader />
                    {!contract.gameResolvedAuto && (<Proposals />)}
                    {contract.gameResolvedAuto && (<GameOver />)}
                </ControlArea>
                {(appService.width > 1380) && (this.renderChat())}
                {(appService.width <= 1380) && (
                    <ChatLogo>
                        <div style={{ flex: 1 }} />
                        123
                    </ChatLogo>
                )}
            </Container>
        );
    }

    private renderChat = () => (
        <ChatArea>
            <Title>Discussion</Title>
            <Messages />
            <InputArea>
                <StyledInput
                    value={this.state.input}
                    onChange={this.inputOnChanged}
                />
                <StyledButton
                    onClick={this.sendMessage}
                >
                    Send
                </StyledButton>
            </InputArea>
        </ChatArea>
    )

    private inputOnChanged = (e) => {
        this.setState({ input: e.target.value });
    }
    private sendMessage = () => {
        const { contract } = networkService;
        const { input } = this.state;
        contract.postMessage(input);
        this.setState({ input: '' });
    }
}
