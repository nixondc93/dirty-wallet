import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const WalletModalButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletModalButton,
  { ssr: false }
);


function Banner() {
  return (
    <Container>
      <LogoContainer>
        <Image src="/logo.svg" alt="logo" height={60} width={80} />
      </LogoContainer>
      <ButtonContainer>
        <Link href="/">Home</Link>
        <ConnectButton>Connect Wallet</ConnectButton>
      </ButtonContainer>
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid lightgray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  border-radius: 40px;
  min-width: 400px;
`;

const LogoContainer = styled.div`
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ConnectButton = styled(WalletModalButton)`
  background-color: #B96BFC;
  padding: 18px 12px;
  border: none;
  border-radius: 32px;
  font-size: 18px;
  margin-left: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  color: white;
`;

export default Banner;