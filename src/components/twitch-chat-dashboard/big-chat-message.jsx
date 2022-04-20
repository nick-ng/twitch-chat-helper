import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const Container = styled.div`
  font-size: 48pt;
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: ${(props) => props.fadeOutDuration || 0}s;
  opacity: ${(props) => props.opacityB};
  flex-basis: 50%;
`;

export default function BigChatMessage({ message, duration }) {
  const [opacity, setOpacity] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpacity(1);

    timeoutRef.current = setTimeout(() => {
      setOpacity(0);
    }, duration * 500);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [message.tags.id]);

  return (
    <Container
      fadeOutDuration={opacity === 1 ? 0.01 : duration / 2}
      opacityB={opacity}
    >
      [{dayjs(message.timestamp).format("HH:mm:ss")}]{" "}
      {message.tags["display-name"]}: {message.message}
    </Container>
  );
}
