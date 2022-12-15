import styled from "@emotion/styled";
import { useState } from "react";
import Receive from "./Receive";
import Send from "./Send";

type ToggleState = "send" | "receive";

function Card() {
  const [toggleControl, setToggleControl] = useState<ToggleState>("send");

  const toggleOnClickHandler = (state: ToggleState) => setToggleControl(state);

  return (
    <Container>
      <CenteredRow>
        <Toggle>
          <ToggleOption 
            active={toggleControl === "send"} 
            onClick={() => toggleOnClickHandler("send")}
          >
            Send
          </ToggleOption>
          <ToggleOption
            active={toggleControl === "receive"} 
            onClick={() => toggleOnClickHandler("receive")}
          >
            Receive
          </ToggleOption>
        </Toggle>
      </CenteredRow>
      {toggleControl === "send" && <Send />}
      {toggleControl === "receive" && <Receive />}
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff;
  border: 1px solid rgba(150, 151, 152, 0.2);
  padding: 16px;
  border-radius: 15px;
  min-height: 400px;
  width: 520px;
  display: flex;
  flex-direction: column;
`;

const Toggle = styled.div`
  display: flex;
  background-color: #F8F8F8;
  padding: 8px;
  border-radius: 20px;
  width: 330px;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const ToggleOption = styled.div<{ active: boolean }>`
  background-color: ${({ active }) => active ? "white" : "#F8F8F8"};
  box-shadow: ${({ active }) => active ? "0px 4px 20px rgba(0, 0, 0, 0.14)" : "none"};
  padding: 12px 48px;
  border-radius: 18px;
  width: 150px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
`

const Row = styled.div`
  display: flex;
`;

const CenteredRow = styled(Row)`
  justify-content: center;
  align-items: center;
`;

export default Card;