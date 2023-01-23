import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 1vw;
  padding-right: 2vw;
  padding-left: 2vw;
  padding-bottom: 1vw;
`;

export const Left = styled.div`
  display: flex;
  flex-basis: 50%;
  flex-grow: 100;
`;

export const Right = styled.div`
  display: flex;
  flex-basis: 50%;
  flex-direction: row-reverse;
  flex-grow: 100;
`;
