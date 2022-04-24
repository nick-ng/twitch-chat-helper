import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router, Switch, Route as R } from "react-router-dom";

import TwitchChatDashboard from "./components/twitch-chat-dashboard";

const GlobalStyle = createGlobalStyle`
body {
  color: white;
  background-color: black;
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

a {
  color: LightSteelBlue;
}
`;

const Container = styled.div``;

export default function App() {
  return (
    <Router>
      <GlobalStyle />
      <Container>
        <TwitchChatDashboard />
      </Container>
    </Router>
  );
}
