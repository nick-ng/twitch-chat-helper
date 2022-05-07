import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const PLAYER_DIV_ID = "twitch-video-widget";

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 30vw;
  height: 30vh;
`;

export default function TwitchVideoWidget({ channel }) {
  const twitchPlayer = useRef(null);
  const qualityChanged = useRef(false);

  useEffect(() => {
    const options = {
      width: "100%",
      height: "100%",
      channel,
    };

    if (!twitchPlayer.current) {
      twitchPlayer.current = new Twitch.Player(PLAYER_DIV_ID, options);
      twitchPlayer.current.addEventListener(Twitch.Player.PLAYING, (e) => {
        if (qualityChanged.current) {
          return;
        }
        qualityChanged.current = true;

        twitchPlayer.current.setMuted(true);
        const qualities = twitchPlayer.current.getQualities();

        const temp = qualities
          .filter((a) => a.height > 0)
          .sort((a, b) => a.height - b.height);

        if (temp.length > 0) {
          twitchPlayer.current.setQuality(temp[0].group);
        }
      });
    } else {
      twitchPlayer.current.setChannel(channel);
    }
  }, [channel]);

  return <Container id={PLAYER_DIV_ID} />;
}
