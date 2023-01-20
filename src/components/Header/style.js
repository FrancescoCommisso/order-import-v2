import styled from "styled-components";

export const Wrapper = styled.div`
  //   background-color: red;
  padding: 20px;
  display: flex;

  border: 1px solid;
  flex-wrap: wrap;
`;

export const Left = styled.div`
  //   background-color: purple;
  display: flex;
  flex-basis: 50%;
  flex-grow: 100;
  p {
    font-weight: 800;
  }
`;

export const Right = styled.div`
  //   background-color: green;
  display: flex;
  flex-basis: 50%;
  flex-direction: row-reverse;
  flex-grow: 100;

  p {
    padding-left: 10px;
    padding-right: 10px;
    font-weight: 800;
  }
`;
