import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from "@chakra-ui/button";
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading'; 
import { getSender} from '../../config/ChatLogic';
function MyChats() {
  const [loggedUser, setLoggedUser] = useState();
  const {  selectedChat, user, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async() => {
    try{
      const config ={
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const{ data } = await axios.get("/api/chat" ,config);
      setChats(data); 
    } catch(error){
      toast({
        title: "Error occured!!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
      fetchChats();
  }, []);
  return( <Box 
        d={{base: selectedChat ? "none" : "flex", md: "flex"}}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{base: "100%",md: "31%"}}
        borderRadius="1g"
        borderWidth="1px"
  >
<Box
pb={3}
fontSize={{ base: "28px", md: "30px"}}
px={3}
fontFamily= "Work sans"
d="flex"
w="100"
justifyContent="space-between"
alignItems="cenetr"
>
My chats
<Button
 d="flex"
 fontSize={{base: "17px", md: "10px", lg: "17px"}}
  rightIcon={<AddIcon />}
  
>
New Group Chat
</Button>
</Box>
<Box
d="flex"
flexDir="column"
p={3}
bg="#f8f8f8"
w="100%"
h="100%"
borderRadius = "1g"
overflowY = "hidden"
>

{chats ? (
  <Stack overflowY = "scroll">
    {
      chats.map((chat) =>(
        <Box 
        onClick={() => setSelectedChat(chat)}
        cursor="pointer"
        bg={selectedChat === chat ? "#38B2AC"  : "#E8E8E8"}
        color={selectedChat === chat? "white" : "black"}
        px={3}
        py={2}
        borderRadius="1g"
        key={chat._id}
        >
 <Text>
  {!chat.isGroupChat? getSender(loggedUser, chat.users):chat.chatName}
 </Text>
        </Box>
      ))
    }

  </Stack>
) : (
  <ChatLoading />
)}
</Box>
  </Box>
  );
};

export default MyChats
