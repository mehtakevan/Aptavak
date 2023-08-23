import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks';
import { IconButton, Button } from '@chakra-ui/button';
import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    Text,
  } from '@chakra-ui/react'

const ProfileModal = ({ user, children}) =>{
    const{ isOpen, onOpen, onClose} = useDisclosure();

    return(
        <>
       {children ? (
        <span onClick={onOpen}>{children}</span>
       ) : (
        <IconButton d={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />
       )}
       <Modal size="lg"isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="40px" fontFamily="Work sans" d="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
           d="flex"
           flexDir="Column"
           alignItems="center"
           justifyContent="space-between"
          >
          <Image 
           borderRdius="full"
           boxSize="150px"
           src={user.pic}
           alt={user.name}
          />

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    );
};



export default ProfileModal
