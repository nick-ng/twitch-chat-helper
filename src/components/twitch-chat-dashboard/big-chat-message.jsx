import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const Container = styled.div`
  font-size: 48pt;
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: ${(props) => props.fadeOutDuration || 0}s;
  opacity: ${(props) => props.opacityB};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justifyContent};
  align-items: flex-start;

  span {
    margin: 5px 0;
  }
`;

export default function BigChatMessage({
  message,
  fadeSeconds,
  fadeStartSeconds,
  textPosition,
}) {
  const [opacity, setOpacity] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpacity(1);

    timeoutRef.current = setTimeout(() => {
      setOpacity(0);
    }, fadeSeconds * 1000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [message.tags.id]);

  return (
    <Container
      fadeOutDuration={opacity === 1 ? 0.01 : fadeStartSeconds}
      opacityB={opacity}
      justifyContent={textPosition || "center"}
    >
      <span>
        [{dayjs(message.timestamp).format("HH:mm:ss")}]{" "}
        {message.tags["display-name"]}: {message.message}
      </span>
    </Container>
  );
}
