import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import useTwitchChatMessages from "../../hooks/twitch-chat-messages";
import TwitchChatWidget from "../twitch-chat-widget";
import BigChatMessage from "./big-chat-message";

const SETTINGS_STORE = "SETTINGS_STORE_TWITCH_CHAT_HELPER";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props) => (props.reverse ? "row-reverse" : "row")};
  align-items: center;
`;

const Controls = styled.div`
  flex-grow: 0;
  flex-basis: 20em;
  align-self: flex-start;
  margin: 0 1em;
`;

export default function TwitchChatDashboard() {
  const [formData, setFormData] = useState({
    channel: "",
    messageCooldown: 10,
  });
  const [channel, setChannel] = useState("");
  const [messages, setTestMessage] = useTwitchChatMessages(channel);
  const [previousMessageTimestamp, setPreviousMessageTimestamp] = useState(0);
  const [messageCooldown, setMessageCooldown] = useState(10000);
  const [notificationMessage, setNotificationMessage] = useState(null);

  const applySettings = useRef((newSettings) => {
    setChannel(newSettings.channel);
    newSettings.messageCooldown &&
      setMessageCooldown(newSettings.messageCooldown);
  }).current;

  useEffect(() => {
    if (!messages[0]) {
      return;
    }

    const { timestamp } = messages[0];

    if (timestamp - previousMessageTimestamp > messageCooldown) {
      setNotificationMessage(messages[0]);
    }

    setPreviousMessageTimestamp(timestamp);
  }, [messages[0]]);

  useEffect(() => {
    try {
      const loadedSettingsString = localStorage.getItem(SETTINGS_STORE);

      if (loadedSettingsString) {
        const loadedSettings = JSON.parse(loadedSettingsString);
        applySettings(loadedSettings);
        setFormData(loadedSettings);
      }
    } catch (e) {
      localStorage.removeItem(SETTINGS_STORE);
    }
  }, []);

  return (
    <Container>
      <TwitchChatWidget twitchChannel={channel} />
      <Controls>
        <h2>Watching {channel}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setChannel(formData.channel);
            setMessageCooldown(formData.messageCooldown);
            localStorage.setItem(SETTINGS_STORE, JSON.stringify(formData));
          }}
        >
          <table>
            <tbody>
              <tr>
                <td>Channel</td>
                <td>
                  <input
                    type="text"
                    value={formData.channel}
                    onChange={(e) => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          channel: e.target.value,
                        };
                      });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Seconds</td>
                <td>
                  <input
                    style={{ textAlign: "right" }}
                    type="number"
                    value={formData.messageCooldown}
                    onChange={(e) => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          messageCooldown: e.target.value,
                        };
                      });
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button>Save</button>
        </form>
        <button
          onClick={() => {
            setTestMessage(`Test ${Date.now()}`);
          }}
        >
          Test
        </button>
        <p>
          If it's been {messageCooldown} seconds since the last message, the
          next message will be displayed in large text briefly.
        </p>
      </Controls>
      {notificationMessage && (
        <BigChatMessage message={notificationMessage} duration={5} />
      )}
    </Container>
  );
}
