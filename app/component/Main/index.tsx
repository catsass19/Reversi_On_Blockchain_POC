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
                                <div>string: {contract.myString}</div>
                                <div>currentSize: {contract.currentSize}</div>
                                <div>fundRaisingPeriod: {contract.fundRaisingPeriod}</div>
                                <div>turnPeriod: {contract.turnPeriod}</div>
                                <div>currentSharePrice: {contract.currentSharePrice}</div>
                                <div>fundRaisingCountingDown: {contract.fundRaisingCountingDown ? 'true' : 'false'}</div>
                                {contract.countingStartedTime && (
                                    <>
                                        <div>countingStartedTime: {contract.countingStartedTime} - {(new Date(Number(contract.countingStartedTime) * 1000)).toLocaleString()}</div>
                                        <div>funding end time: {(
                                            new Date(
                                                (Number(contract.countingStartedTime) + Number(contract.fundRaisingPeriod)) * 1000
                                            )).toLocaleString()} </div>
                                    </>
                                )}
                                <div>teamCatFunding: {contract.teamCatFunding}</div>
                                <div>teamDogFunding: {contract.teamDogFunding}</div>
                                {contract.userStatus && (
                                    <>
                                        <div>team {contract.userStatus.team}</div>
                                        <div>cat share {contract.userStatus.catShare}</div>
                                        <div>dog share {contract.userStatus.dogShare}</div>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        const string = prompt('new string');
                                        if (string) {
                                            contract.setString(string);
                                        }
                                    }}
                                >
                                    set string
                                </button>
                                <button
                                    onClick={() => {
                                        const value = prompt('How much do you want to fund for cat?');
                                        if (value) {
                                            contract.fund(contract.TEAM.CAT, value);
                                        }
                                    }}
                                >
                                    fund cat
                                </button>
                                <button
                                    onClick={() => {
                                        const value = prompt('How much do you want to fund for dog?');
                                        if (value) {
                                            contract.fund(contract.TEAM.DOG, value);
                                        }
                                    }}
                                >
                                    fund dog
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
