import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--component-margin);
  button {
    height: 70px;
  }
  textarea {
    min-height: 1000px;
    resize: none;
  }
`;
