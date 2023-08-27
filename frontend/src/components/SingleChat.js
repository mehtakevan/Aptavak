import React, { useEffect, useState}from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './Miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import { FormControl, Spinner, Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
 import Lottie from "react-lottie";
 import animationData from "../animations/typing.json";
// import { Client } from 'socket.io/dist/client';
 
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain,  }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { user,selectedChat, setSelectedChat, notification, setNotification } = ChatState();
 
  const toast = useToast();
  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  console.log(messages);
  //USEFFECT 0
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  
  }, []);
  //USEFFECT1
     useEffect(() => {
      fetchMessages();
      selectedChatCompare = selectedChat;

     }, [selectedChat]);

     console.log(notification, "-----------------");
//USEFFECT2
     useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });
    //ENDS
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
       socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (<>
  { selectedChat ?(
     
      <>
      <Text  
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">

               <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
        {!selectedChat.isGroupChat ? (
          <>
           {getSender(user, selectedChat.users)}  
           
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />

          </>
        ) : (
          <>
          {selectedChat.chatName.toUpperCase()}
          <UpdateGroupChatModal
             fetchAgain={fetchAgain}
             setFetchAgain={setFetchAgain}
             fetchMessages={fetchMessages}
          />
          </>
        )}

      </Text>
      <Box 
       d="flex"
       flexDir="column"
       justifyContent="flex-end"
       p={3}
       bg="#E8E8E8"
       w="100%"
       h="92%"
       borderRadius="lg"
       overflowY="hidden"
      >
        {/* {!loading ? <Spinner /> : <></>} */}
        {!loading ? (
          <Spinner
             size="x1"
             w={20}
             h={20}
             alignSelf="center"
             margin-Top="20px"
          />
        ) :(
          <div>
            <div className="messages">
                <ScrollableChat messages={messages} />
              </div>

          </div>
        )}

        <FormControl   
           onKeyDown={sendMessage}
           isRequired
            position="absolute"
            bottom="35px"
           left="610px"
           width="48%"
          //  top="100"
            >
               {istyping ? (
                <div>
                 <Lottie 
                 options={defaultOptions}
                 width={70}
                 style={{ marginBottom: 150, marginLeft: 0}}
                 />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />

           
        </FormControl>
        


      </Box>
      </>
    ) : (
      <>
      <h1>Select a user</h1>
        </>
    )}
  
  </>
  );
};

export default SingleChat;
