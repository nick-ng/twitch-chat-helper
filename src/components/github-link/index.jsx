import React from "react";
import styled from "styled-components";

import Icon from "../icon";

const Container = styled.a`
  text-decoration: none;
  color: #cccccc;
`;

export default function GithubLink({ size }) {
  return (
    <Container
      target="_blank"
      href="https://github.com/nick-ng/twitch-chat-helper"
    >
      <Icon icon="fa-github" size={size} />
    </Container>
  );
}
