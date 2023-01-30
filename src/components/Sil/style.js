import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--component-margin);

  button {
    height: 70px;
  }
  textarea {
    flex-basis: 100%;
    min-height: 400px;
    resize: none;
  }
`;
