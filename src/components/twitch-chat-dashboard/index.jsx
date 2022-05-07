import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import useTwitchChatMessages from "../../hooks/twitch-chat-messages";
import TwitchChatWidget from "../twitch-chat-widget";
import TwitchVideoWidget from "../twitch-video-widget";
import BigChatMessage from "./big-chat-message";
import GithubLink from "../github-link";

const SETTINGS_STORE = "SETTINGS_STORE_TWITCH_CHAT_HELPER";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: ${(props) => (props.reverse ? "row-reverse" : "row")};
  align-items: center;
`;

const ColumnTwo = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  align-self: flex-start;
  margin: 0 1em;
  height: 100vh;

  p {
    max-width: 20em;
  }

  input {
    width: 5em;
  }
`;

export default function TwitchChatDashboard() {
  const [formData, setFormData] = useState({
    channel: "",
    messageCooldown: 10,
    fadeStartSeconds: 5,
    fadeSeconds: 1,
    showFullChat: false,
    showVideo: false,
  });
  const [activeSettings, setActiveSettings] = useState({
    channel: "",
    messageCooldown: 10,
    fadeStartSeconds: 5,
    fadeSeconds: 1,
    showFullChat: false,
    showVideo: false,
  });
  const [messages, setTestMessage] = useTwitchChatMessages(
    activeSettings.channel
  );
  const [previousMessageTimestamp, setPreviousMessageTimestamp] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState(null);

  const applySettings = useRef((newSettings) => {
    setActiveSettings((prev) => ({
      channel: newSettings.channel,
      messageCooldown: newSettings.messageCooldown
        ? parseInt(newSettings.messageCooldown, 10) * 1000
        : prev.messageCooldown,
      fadeStartSeconds: newSettings.fadeStartSeconds
        ? parseInt(newSettings.fadeStartSeconds, 10)
        : prev.fadeStartSeconds,
      fadeSeconds: newSettings.fadeSeconds
        ? parseInt(newSettings.fadeSeconds, 10)
        : prev.fadeSeconds,
      showFullChat: newSettings.showFullChat,
      showVideo: newSettings.showVideo,
    }));
  }).current;

  useEffect(() => {
    if (!messages[0]) {
      return;
    }

    const { timestamp } = messages[0];

    if (timestamp - previousMessageTimestamp > activeSettings.messageCooldown) {
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
      {activeSettings.showFullChat && (
        <TwitchChatWidget twitchChannel={activeSettings.channel} />
      )}
      <ColumnTwo>
        {activeSettings.channel ? (
          <h2>{activeSettings.channel}</h2>
        ) : (
          <p>Open Settings and set a channel</p>
        )}
        <details>
          <summary>Settings</summary>
          <p>Times are in seconds</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applySettings(formData);
              localStorage.setItem(SETTINGS_STORE, JSON.stringify(formData));
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td>Show Full Chat</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={formData.showFullChat}
                      onChange={(e) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            showFullChat: !prev.showFullChat,
                          };
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Show Video</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={formData.showVideo}
                      onChange={(e) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            showVideo: !prev.showVideo,
                          };
                        });
                      }}
                    />
                  </td>
                </tr>
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
                  <td>Between Messages</td>
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
                <tr>
                  <td>Before Fadeout</td>
                  <td>
                    <input
                      style={{ textAlign: "right" }}
                      type="number"
                      value={formData.fadeStartSeconds}
                      onChange={(e) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            fadeStartSeconds: e.target.value,
                          };
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Fadeout Duration</td>
                  <td>
                    <input
                      style={{ textAlign: "right" }}
                      type="number"
                      value={formData.fadeSeconds}
                      onChange={(e) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            fadeSeconds: e.target.value,
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
            If it's been <b>{activeSettings.messageCooldown / 1000}</b> seconds
            since the last message, the next message will be displayed in large
            text for <b>{activeSettings.fadeStartSeconds}</b> then fade out over{" "}
            <b>{activeSettings.fadeSeconds}</b>.
          </p>
          <GithubLink size="24px" />
        </details>
        {notificationMessage && (
          <BigChatMessage
            message={notificationMessage}
            fadeSeconds={activeSettings.fadeSeconds}
            fadeStartSeconds={activeSettings.fadeStartSeconds}
          />
        )}
      </ColumnTwo>
      {activeSettings.showVideo && (
        <TwitchVideoWidget channel={activeSettings.channel} />
      )}
    </Container>
  );
}
