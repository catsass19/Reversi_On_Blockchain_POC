import * as React from 'react';
import styled from 'styled-components';
import networkService from '@/service/network';

import Messages from './Messages';

const ChatArea = styled.div`
    /* border-left: 1px solid rgba(255, 255, 255, 0.5); */
    min-height: 0px;
    max-width: 400px;
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

export default class Chat extends React.Component {

  public state = {
    input: '',
  };

  public render() {
    return (
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
    );
  }

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
