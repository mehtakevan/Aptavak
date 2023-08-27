import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from "@chakra-ui/react";
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain}) => {
    const { selectedChat } = ChatState();
    console.log('Selected Chat:', selectedChat);
    return (
        <Box 
            d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "280%", }} // Adjust width here
            h="85vh" // Adjust height here
            borderRadius="lg"
            borderWidth="1px"
            ml={{ base: 0, md: -650.5 }}
        >
            {selectedChat && (
                <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
        </Box>
    );
};

export default ChatBox;
