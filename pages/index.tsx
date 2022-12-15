import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Banner from '../components/Banner';
import Card from '../components/Card';

const WalletDisconnectButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
  { ssr: false }
);


export default function Home() {
  return (
    <Container>
      <Banner />
      <Body>
        <LeftPanel>
          <Image src="/wallet-icon.svg" alt="wallet icon" width={329} height={248} />
          <Header>Acme Inc. Wallet</Header>
          <SubHeader>Send Solana to your friends!</SubHeader>
        </LeftPanel>
        <RightPanel>
          <Card />
        </RightPanel>
      </Body>
    </Container>
  )
}

const Container = styled.div`
  padding: 40px;
`;

const Body = styled.div`
  padding: 80px;
  display: flex;
  justify-content: space-between;
`;

const RightPanel = styled.div`
  min-width: 400px;
`;

const LeftPanel = styled.div`
  min-width: 400px;
`;

const Header = styled.h1`
  font-weight: 500;
  font-size: 72px;
  line-height: 120%;
  margin-bottom: 8px;
`;

const SubHeader = styled.h3`
  color: #999999;
  font-weight: 375;
  font-size: 24px;
  line-height: 130%;
  margin-top: 0;
`;
