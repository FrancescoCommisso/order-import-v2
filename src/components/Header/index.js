import React, { Component, useRef } from "react";
import { Wrapper, Left, Right } from "./style";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Header = ({ email, signOut, switchTheme }) => {
  return (
    <Wrapper>
      <ReactTooltip anchorId="user" />
      <Left>
        <p className="header">Order Import V2</p>
      </Left>

      <Right>
        <button
          className="iconButton"
          onClick={() => {
            console.log("signing out");
            signOut();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M5 5h7V3H3v18h9v-2H5z" />
            <path fill="currentColor" d="m21 12l-4-4v3H9v2h8v3z" />
          </svg>
        </button>
        <button className="iconButton" onClick={switchTheme}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M128 56a72 72 0 1 0 72 72a72.1 72.1 0 0 0-72-72Zm0 120a48 48 0 1 1 48-48a48 48 0 0 1-48 48ZM116 28v-8a12 12 0 0 1 24 0v8a12 12 0 0 1-24 0Zm74.2 37.8a12 12 0 0 1 0-17l5.7-5.7a12 12 0 0 1 17 17l-5.7 5.7a12 12 0 0 1-8.5 3.5a12.2 12.2 0 0 1-8.5-3.5ZM248 128a12 12 0 0 1-12 12h-8a12 12 0 0 1 0-24h8a12 12 0 0 1 12 12Zm-35.1 67.9a12.2 12.2 0 0 1 0 17a12.4 12.4 0 0 1-8.5 3.5a12 12 0 0 1-8.5-3.5l-5.7-5.7a12 12 0 0 1 17-17ZM140 228v8a12 12 0 0 1-24 0v-8a12 12 0 0 1 24 0Zm-74.2-37.8a12 12 0 0 1 0 17l-5.7 5.7a12 12 0 0 1-8.5 3.5a12.4 12.4 0 0 1-8.5-3.5a12.2 12.2 0 0 1 0-17l5.7-5.7a12 12 0 0 1 17 0ZM40 128a12 12 0 0 1-12 12h-8a12 12 0 0 1 0-24h8a12 12 0 0 1 12 12Zm3.1-67.9a12 12 0 0 1 17-17l5.7 5.7a12 12 0 0 1 0 17a12.2 12.2 0 0 1-8.5 3.5a12 12 0 0 1-8.5-3.5Z"
            />
          </svg>
        </button>
        <button id="user" data-tooltip-content={email} className="iconButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 23l-3-3H5q-.825 0-1.413-.587Q3 18.825 3 18V4q0-.825.587-1.413Q4.175 2 5 2h14q.825 0 1.413.587Q21 3.175 21 4v14q0 .825-.587 1.413Q19.825 20 19 20h-4Zm0-11q1.45 0 2.475-1.025Q15.5 9.95 15.5 8.5q0-1.45-1.025-2.475Q13.45 5 12 5q-1.45 0-2.475 1.025Q8.5 7.05 8.5 8.5q0 1.45 1.025 2.475Q10.55 12 12 12Zm0 8.2l2.2-2.2H19v-1.15q-1.35-1.325-3.137-2.088Q14.075 14 12 14t-3.862.762Q6.35 15.525 5 16.85V18h4.8Z"
            />
          </svg>
        </button>
      </Right>
    </Wrapper>
  );
};

export default Header;
