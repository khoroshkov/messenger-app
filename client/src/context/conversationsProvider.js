import React, { useContext, useState, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./contactsProvider";
import arrayEquality from "../services/helpers";
import { useSocket } from "./socketProvider";

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts();
  const socket = useSocket();

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prevConversations) => {
        let isMadeChange = false;
        const newMessage = { sender, text };
        const newConversations = prevConversations.map((conversation) => {
          if (arrayEquality(conversation.recipients, recipients)) {
            isMadeChange = true;
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            };
          }

          return conversation;
        });

        if (isMadeChange) {
          return newConversations;
        } else {
          return [...prevConversations, { recipients, message: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-message", addMessageToConversation);

    return () => {
      socket.off("receive-message");
    };
  }, [socket, addMessageToConversation]);

  function sendMessage(recipients, text) {
    socket.emit("send-message", { recipients, text });
    addMessageToConversation({ recipients, text, sender: id });
  }

  function createConversations(recipients) {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }];
    });
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      });
      const name = (contact && contact.name) || recipient;
      return { id: recipient, name };
    });

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => {
        return contact.id === message.sender;
      });
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe };
    });

    const selected = index === selectedConversationIndex;
    return { ...conversation, messages, recipients, selected };
  });

  return (
    <ConversationsContext.Provider
      value={{
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        selectedConversationIndex: setSelectedConversationIndex,
        createConversations,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
