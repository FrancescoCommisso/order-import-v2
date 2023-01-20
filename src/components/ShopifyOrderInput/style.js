import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  p {
    text-align: center;
  }
`;

export const Inputs = styled.div`
  display: flex;
  justify-content: space-between;

  input {
    flex-basis: 90%;
    height: 50px;
    text-align: center;
  }

  button {
    flex-basis: 5%;
  }
`;
