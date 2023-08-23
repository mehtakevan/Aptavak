import React from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { withTheme } from '@emotion/react';
import { useHistory } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';

const HomePage = () => {

  const history = useHistory();
  useEffect(() =>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // setUser(userInfo);

   if(userInfo){
      history.push("/chats");
   }
  }, [history]);
  
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center" /* Add this to center text vertically */
        p={3}
        bg='rgba(0, 0,0, 0.7)'
        w="100%"
        m="20px 0px 0"
       
        borderWidth="1px"
        
        
      >
       
        {/* <Text fontSize="5xl" fontFamily="poppins" color="white" textAlign="center">
          Aptavak
        </Text> */}
        <Text fontSize="5xl" fontFamily="poppins" color="white" textAlign="center">
  <span style={{ color: 'rgb(103, 234, 237)' }}>A</span>ptavak
</Text>
      </Box>
      <Box background = 
     
       "black"
     
    color =  'white'
      w="100%"
      p={10}
      // borderRadius="50"
      borderWidth="1px"

      // m="20px 0.15px 0"
      >
        <Tabs variant="enclosed" >
  <TabList mb='1em'>
    <Tab width="50%" fontSize="25px" fontFamily={'poppins'}color={'rgb(103, 234, 237)'} background={'black'}  >Login</Tab>
    <Tab width="50%" fontSize="25px" fontFamily={'poppins'} color={'rgb(103, 234, 237)'} background={'black'}>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel> <Login/> </TabPanel>
    <TabPanel>   <Signup/></TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
