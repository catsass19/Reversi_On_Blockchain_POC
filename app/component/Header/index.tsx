import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import networkService from '@/service/network';
import appService from '@/service/app';
import DisplayItem from '@/component/DisplayItem';
import deversi from '@/assets/deversi.svg';
import dekusan from '@/assets/dekusan.svg';
import dexon from '@/assets/dexon.png';

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 30px;
`;
const WhiteText = styled.span`
    color: #CCC;
`;
const Logo = styled.img`
    height: 40px;
    margin: 20px 0px;
`;
const Title = styled.div`
    font-size: 40px;
    margin: 0px 20px;
`;
const Padding = styled.div`
    flex: 1;
`;

const Requirement = styled.div`
    padding: 20px 40px;
`;
const LogoArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const PromoteLogo = styled.img`
    height: ${(p) => (p.height || '150px')};
`;
const DekuSanLink = 'https://chrome.google.com/webstore/detail/dekusan/anlicggbddjeebblaidciapponbpegoj';

const Dexon = styled.div`
    padding: 20px;
    height: 150px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    margin: 40px;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;
const DekuSan = styled.div`
    margin: 40px;
    padding: 20px;
    height: 150px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;
const DekuSanTitle = styled.div`
    font-size: 20px;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
`;
const PopupTitle = styled.div`
    color: white;
    padding: 20px 0px;
    font-size: x-large;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
`;

const openPage = (url) => {
    window.open(url, '_blank');
};
const Highlight = styled.span`
    color: orchid;
    font-weight: bold;
`;

const Button = styled.div`
    border: 1px solid #13BF99;
    font-size: x-large;
    text-align: center;
    padding: 10px;
    margin-top: 20px;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;

@observer
export default class Header extends React.Component {

    public componentDidMount() {
        if (!appService.isMobile) {
            appService.openModal(
                <Requirement>
                    <PopupTitle>
                        Deversi is running on <Highlight>DEXON</Highlight> blocklattice<br />
                        Get <Highlight>DekuSan</Highlight> wallet today to explore the power of DEXON
                    </PopupTitle>
                    <LogoArea>
                        <Dexon onClick={() => openPage('https://dexon.org')}>
                            <PromoteLogo src={dexon} />
                        </Dexon>
                        <DekuSan onClick={() => openPage(DekuSanLink)}>
                            <PromoteLogo src={dekusan} height={115}/>
                            <div style={{ flex: 1 }} />
                            <DekuSanTitle>DekuSan Wallet</DekuSanTitle>
                        </DekuSan>
                    </LogoArea>
                    <Button
                        onClick={() => appService.closeModal()}
                    >
                        Got it
                    </Button>
                </Requirement>
            );
        }
    }

    public render() {
        const { contract } = networkService;
        return (
            <Container>
                <Logo src={deversi} />
                <Title>
                    <WhiteText>De</WhiteText>
                    versi
                </Title>
                <Padding />
                <DisplayItem
                    title='Price Per Share'
                    amount={contract.currentSharePrice}
                    unit={'DEX'}
                />
                <DisplayItem
                    title='Total Funds'
                    amount={contract.totalBalance}
                    unit={'DEX'}
                />
                {contract.myTeam && (
                    <DisplayItem
                        title='My Team'
                        amount={contract.myTeam}
                    />
                )}
            </Container>
        );
    }
}
