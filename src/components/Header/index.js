import React, { Component } from "react";
import { Wrapper, Left, Right } from "./style";

const Header = ({ email, signOut, switchTheme }) => {
  return (
    <Wrapper>
      <Left>
        <p>Order Import V2</p>
      </Left>

      <Right>
        <button
          onClick={() => {
            console.log("signing out");
            signOut();
          }}
        >
          Sign Out
        </button>
        <button onClick={switchTheme}>Switch Theme</button>
        <p>{email}</p>
      </Right>
    </Wrapper>
  );
};

export default Header;
