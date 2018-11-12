import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';

const InitMessage = styled.div`
    padding: 20px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.1);
`;
const Message = styled.div`
    padding: 30px 20px;
    border-bottom: 1px solid rgba(255 ,255, 255, 0.2);
`;
const Text = styled.div`
    font-size: larger;
    word-break: break-all;
`;
const MessageInfo = styled.div`
    display: flex;
    align-items: center;
    font-size: small;
`;
const Sender = styled.div`
    display: flex;
    align-items: center;
`;
const Address = styled.span`
    overflow: hidden;
    width: 100px;
    color: rgba(255 ,255, 255, 0.5);
    margin-left: 5px;
`;
const Time = styled.div`
    color: #888;
`;
const Padding = styled.div`
    flex: 1;
`;
const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: rgba(255, 255, 255, 0.3);
    overflow-y: auto;
`;

@observer
export default class Messages extends React.Component {

    private ref;

    public componentDidMount() {
        this.scrollToBottom();
    }

    public componentDidUpdate() {
        this.scrollToBottom();
    }

    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <InitMessage>
                    Whatever you say stays on blockchain forever so please mind your manner ☺
                </InitMessage>
                {contract.messages.map((it) => (
                    <Message key={`${it.time}`}>
                      <Text>{it.msg}</Text>
                      <MessageInfo>
                          <Sender>from <Address>{it.sender}</Address>...</Sender>
                          <Padding />
                          <Time>{it.time.toString()}</Time>
                      </MessageInfo>
                    </Message>
                ))}
                <div
                  ref={(ref) => this.ref = ref}
                />
            </Container>
        );
    }

    private scrollToBottom = () => {
      this.ref.scrollIntoView({ behavior: 'smooth' });
  }
}
