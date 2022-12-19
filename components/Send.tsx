import styled from "@emotion/styled";
import Image from "next/image";
import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionError } from "@solana/web3.js";

const lamportCoversionRate = 1000000000;

function Send() {
  const [value, setValue] = useState<string>("0");
  const [balance, setBalance] = useState<number>();
  const [blockTime, setBlockTime] = useState<number | null>(null);
  const [fee, setFee] = useState<number>()
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const toast = useToast()

  const fetchBalance = async () => {
    if(publicKey) {
      const result = await connection.getBalance(publicKey);
      setBalance(result)
    }
  };

  const fetchBlockConfirmationTime = async () => {
    if(publicKey) {
      const confirmedSlot = await connection.getSlot('confirmed');
      const [block1, block2] = await Promise.all([
        connection.getBlockTime(confirmedSlot),
        connection.getBlockTime(confirmedSlot - 1)
      ]);
      
      if( block1 && block2){
        const dateX = new Date(block1 * 1000);
        const dateY = new Date(block2 * 1000);
        const result = dateX.getTime() - dateY.getTime(); 
        setBlockTime(result);
      }

    }
  }

  const fetchFee = async () => {
    if (publicKey) {
      const recentBlockhash = await connection.getLatestBlockhash();

      // TODO: address deprecation warning
      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: publicKey
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 10,
        })
      );

      const fees = await transaction.getEstimatedFee(connection);
      setFee(fees / lamportCoversionRate);
    }
  }

  useEffect(() => { 
    fetchBalance();
    fetchBlockConfirmationTime();
    fetchFee();
  }, [connection, publicKey])

  const handleValueOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const handleOnSend = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    try {
      const lamports = parseFloat(value) * lamportCoversionRate;

      if (Number.isNaN(lamports)) {
        alert("Incorrect value. Cannot send.")
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports,
        })
      );
        
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();
        
      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      
      const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

      if (confirmation.value.err) {
        const error = confirmation.value.err;
        if (typeof error === "string"){
          toast({
            title: 'An Error ocurred:',
            description: error,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'An Error ocurred:',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        
        fetchBalance();
        toast({
          title: 'Transaction send successfully',
          description: <a href={`https://solscan.io/tx/${signature}?cluster=devnet`}>See on SolScan</a>,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setValue("0")

      }

    } catch (error) {
      if (typeof error === "string") {
        toast({
          title: 'An Error ocurred:',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'An Error ocurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <Container>
      <CenteredFlex>
        <Image src="/solana-coin.svg" alt="Solana logo" height={40} width={40} />
        <Ticker>SOL</Ticker>
      </CenteredFlex>
      <CenteredFlex>
        <InputAmount type="number" min={0} value={value} onChange={(e) => handleValueOnChange(e)}/>
      </CenteredFlex>
      <CenteredFlex>
        {balance !== undefined && (
          <Balance>
            Current Balance: {balance / lamportCoversionRate} SOL
            <MaxButton>Max</MaxButton>
          </Balance>
        )}
      </CenteredFlex>
      <Flex>
        <SendAmountContainer>
          <SendAmount>
            <GrayText>You will send</GrayText>
            <Amount>{value} { /* TODO: convert amount to USD */}</Amount>
          </SendAmount>

          <CenteredFlex>
              <Image src="/solana-coin-dark.svg" alt="Solana logo" height={24} width={24} />
            <CurrencyText>Solana</CurrencyText>
          </CenteredFlex>
        </SendAmountContainer>
      </Flex>
      <CenteredFlex>
        <SendButton onClick={handleOnSend}>Send SOL</SendButton>
      </CenteredFlex>
      <PaddedRow>
        <GrayText>1 SOL</GrayText>
        <span>--</span>
      </PaddedRow>
      <PaddedRow>
        <GrayText>Confirmation time</GrayText>
        <span>{ typeof blockTime === "number" ? `~${blockTime / 1000} second${blockTime / 1000 !== 1 ? 's' : ''}` : "--"}</span>
      </PaddedRow>
      <PaddedRow>
        <GrayText>Network fee</GrayText>
        <span>{fee || "--"}</span>
      </PaddedRow>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const StatusMessage = styled.span`

`;

const Flex = styled.div`
  display: flex;
`;

const CenteredFlex = styled(Flex)`
  justify-content: center;
  align-items: center;
`;

const PaddedRow = styled(Flex)`
  padding: 12px 0;
  justify-content: space-between;
`;

const InputAmount = styled.input`
  font-size: 84px;
  padding: 32px 0;
  color: black;
  border: none;
  background-color: inherit;
  width: 100%;
  text-align: center;
  -webkit-appearance: none;
  
  :focus {
    outline: none;
  }

`;

const Balance = styled.div`
  border: 1px solid #F1F1F1;
  padding: 8px;
  border-radius: 24px;
  margin-bottom: 32px;
  display: flex;
`;

const SendAmountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SendAmount = styled.div`

`;

const Amount = styled.div`
  margin-top: 12px;
  font-weight: 375;
  font-size: 24px; 
`;

const CurrencyText = styled.span`
  display: inline-block;
  padding-left: 12px;
  font-size: 18px;
`; 


const SendButton = styled.button`
  width: 100%;
  background-color: #B96BFC;
  border: none;
  color: white;
  font-size: 16px;
  padding: 16px;
  margin: 24px 0;
  border-radius: 24px;
  cursor: pointer;
`;

const GrayText = styled.span`
  color: #969798;
`;

const Ticker = styled.span`
  display: inline-block;
  padding-left: 8px;
  font-size: 28px;
`;

const MaxButton = styled.button`
  margin-left: 12px;
  padding: 4px 8px;
  gap: 8px;
  border: none;
  color: #B88454;
  width: 47px;
  height: 22px;
  display: flex;
  align-items: center;
  background: rgba(184, 132, 84, 0.1);
  border-radius: 25px;
`;

export default Send;
