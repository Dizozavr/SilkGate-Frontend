import React, { useState } from 'react';
import ChatBotIcon from './ChatBotIcon';
import ChatBotModal from './ChatBotModal';

const ChatBot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ChatBotIcon onOpen={handleOpenModal} />
      <ChatBotModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ChatBot; 