import React, { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";

export default function useTwitchChatMessages(channel) {
  const [messages, setMessages] = useState([]);
  const addTestMessage = useRef((messageText) => {
    setMessages((prev) => {
      return [
        {
          channel: channel,
          tags: {
            "badge-info": null,
            badges: null,
            "client-nonce": "1",
            color: "#0000FF",
            "display-name": "Test",
            emotes: null,
            "first-msg": false,
            flags: null,
            id: `test-${Date.now()}`,
            mod: false,
            "room-id": "0",
            subscriber: false,
            "tmi-sent-ts": Date.now(),
            turbo: false,
            "user-id": "0",
            "user-type": null,
            "emotes-raw": null,
            "badge-info-raw": null,
            "badges-raw": null,
            username: "test",
            "message-type": "chat",
          },
          message: messageText,
          self: false,
          timestamp: Date.now(),
        },
      ].concat(prev);
    });
  }).current;

  useEffect(() => {
    if (!channel) {
      return [[], addTestMessage];
    }
    console.info("connecting to ", channel);
    const client = new tmi.Client({
      options: {},
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [channel],
    });

    client.connect().catch((e) => {
      console.error(e);
    });

    client.on("message", (channel, tags, message, self) => {
      setMessages((prev) => {
        return [
          {
            channel,
            tags,
            message,
            self,
            timestamp: parseInt(tags?.["tmi-sent-ts"], 10),
          },
        ]
          .concat(prev)
          .slice(0, 1000);
      });
    });

    return () => {
      console.info("disconnecting from ", channel);
      client.disconnect();
    };
  }, [channel]);

  return [messages, addTestMessage];
}
