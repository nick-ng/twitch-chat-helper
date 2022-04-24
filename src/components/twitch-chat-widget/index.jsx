import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 99vh;
  box-sizing: border-box;

  iframe {
    border: none;
  }
`;

export default function TwitchChatWidget({ twitchChannel }) {
  const parent = location.hostname;
  return (
    <Container>
      {twitchChannel && (
        <iframe
          src={`https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${parent}&darkpopout`}
          height="100%"
          width="345px"
        />
      )}
    </Container>
  );
}
