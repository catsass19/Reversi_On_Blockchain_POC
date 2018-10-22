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
`;
const MessageInfo = styled.div`
    display: flex;
    align-items: center;
`;
const Sender = styled.div`
    font-size: 5px;
    display: flex;
    align-items: center;
`;
const Address = styled.span`
    overflow: hidden;
    font-size: 5px;
    width: 100px;
    color: rgba(255 ,255, 255, 0.5);
    margin-left: 5px;
`;
const Time = styled.div`
    font-size: 5px;
    color: #888;
`;
const Padding = styled.div`
    flex: 1;
`;

@observer
export default class Messages extends React.Component {

    private ref;

    public componentDidUpdate() {

    }

    public render() {
        const { contract } = networkService;
        return (
            <div
                ref={(ref) => this.ref}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                  overflowY: 'auto',
                }}
            >
                <InitMessage>
                    You can't post message if you are not able to make proposal.
                    Whatever you say stays on blockchain forever so please mind your manner.
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
            </div>
        );
    }
}
