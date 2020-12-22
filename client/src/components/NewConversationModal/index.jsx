import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useContacts } from "../../context/contactsProvider";
import { useConversations } from "../../context/conversationsProvider";

const NewConversationModal = ({ closeModal }) => {
  const [selectedContactsIds, setSelectedContactsIds] = useState([]);
  const { contacts } = useContacts();
  const { createConversations } = useConversations();

  const handleCheckboxChange = (contactId) => {
    setSelectedContactsIds((prevSelectedContactsIds) => {
      if (prevSelectedContactsIds.includes(contactId)) {
        return prevSelectedContactsIds.filter((prevId) => {
          return contactId !== prevId;
        });
      } else {
        return [...prevSelectedContactsIds, contactId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createConversations(selectedContactsIds);
    closeModal();
  };

  return (
    <div>
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts?.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                value={selectedContactsIds.includes(contact.id)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}
          <Button type="submit">Start conversation</Button>
        </Form>
      </Modal.Body>
    </div>
  );
};

export default NewConversationModal;
