import React from "react";

export default function TwitchChatWidget({ twitchChannel }) {
  const parent = location.hostname;
  return (
    twitchChannel && (
      <iframe
        src={`https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${parent}&darkpopout`}
        height="100%"
        width="345px"
      />
    )
  );
}
