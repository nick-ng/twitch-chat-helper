import React from "react";
import styled from "styled-components";

import NavLink, { StyledIcon } from "./nav-link";

const NavContainer = styled.div`
  padding: 5px;
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  align-content: start;
  gap: 12px;
`;

const GithubLink = styled.a`
  position: fixed;
  bottom: 14px;
  left: 14px;
  text-decoration: none;
  color: #cccccc;
`;

export default function Nav() {
  return (
    <NavContainer>
      <NavLink icon="fa-twitch" to="/" exact>
        Twitch Chat Helper
      </NavLink>
      <GithubLink
        target="_blank"
        href="https://github.com/nick-ng/twitch-chat-helper"
      >
        <StyledIcon icon="fa-github" />
      </GithubLink>
    </NavContainer>
  );
}
