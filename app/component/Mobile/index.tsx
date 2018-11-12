import * as React from 'react';
import styled from 'styled-components';
import deversi from '@/assets/deversi.svg';
import board from '@/assets/board.png';
import dexon from '@/assets/dexon.png';

const Board = styled.img`
    margin-top: 20px;
    height: 300px;
`;
const Dexon = styled.img`
    margin-top: 20px;
    width: 150px;
    cursor: pointer;
`;

const Container = styled.div`
    background-color: black;
    color: #13BF99;
    min-height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;
const Header = styled.div`
    padding: 20px;
    display: flex;
    align-items: center;
`;
const Row = styled.div`
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;
const Title = styled.span`
  color: ${(p) => (p.color || '#13BF99')};
  font-size: xx-large;
`;
const Logo = styled.img`
    height: 40px;
    margin-right: 20px;
`;
const Hint = styled.div`
    padding: 0px 20px;
    color: rgba(255, 255, 255, 0.6);
    font-size: smaller;
    text-align: center;
`;
const Description = styled.div`
    font-size: x-large;
`;
const Highlight = styled.span`
    color: orchid;
`;
const Variable = styled.span`
    color: rgba(255 ,255, 255, 0.7);
`;
const Subtitle = styled.div`
    color: white;
    font-size: xx-large;
    text-align: center;
    padding: 20px;
`;
const List = styled.div`
    text-align: center;
    padding: 20px 40px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 10px 80px;
`;
const PoweredBy = styled.div`
    font-size: x-large;
    color: white;
    text-align: center;
    margin-top: 40px;
`;

const Mobile = () => (
  <Container>
      <Header>
          <Logo src={deversi} />
          <Title color={'rgba(255, 255, 255, 0.7)'} >De</Title>
          <Title>versi</Title>
      </Header>
      <Row>
          <Board src={board} />
      </Row>
      <Row>
          <Description>
              <Variable>Deversi</Variable> is a Reversi game running on <Highlight>Dexon</Highlight> blocklattice
          </Description>
      </Row>
      <Hint>
          To play Deversi, please use desktop browser with width larger than 1200px
      </Hint>
      <Row />
      <Subtitle>More than just Reversi</Subtitle>
      <List>
          It's <Variable>Multi-player! </Variable>
          <br/>Unlike traditional Reversi, everyone can join at anytime and make decisions <Variable>Together</Variable>
      </List>
      <List>
          Powered by <Variable>Smart Contract</Variable> with <Variable>Trust</Variable> and <Variable>Transparency</Variable>
      </List>
      <List>
          The <Variable>Earlier</Variable> you get invole the more <Variable>Prize</Variable> might go to you
      </List>
      <List>
          Each round is like a <Variable>Marathon</Variable> and the result is <Variable>Unpredictable</Variable>
      </List>
      <PoweredBy>Deversi is running on</PoweredBy>
      <Row>
          <Dexon
            src={dexon}
            onClick={() => window.open('https://dexon.org', '_blank')}
          />
      </Row>
      <Row />
  </Container>
);

export default Mobile;
