import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import Login from "../Login";
import Dashboard from "../Dashboard";
import { ContactsProvider } from "../../context/contactsProvider";
import { ConversationsProvider } from "../../context/conversationsProvider";
import { SocketProvider } from "../../context/socketProvider";

function App() {
  const [id, setId] = useLocalStorage("id");

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  );

  return id ? dashboard : <Login onIdSubmit={setId} />;
}

export default App;
