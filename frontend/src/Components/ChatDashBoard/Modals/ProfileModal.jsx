import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { Image } from "@chakra-ui/react";
export default function ProfileModal({ children, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}> {children}</span>
      ) : (
        <IconButton onClick={onOpen} icon={<ViewIcon />}></IconButton>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={35}
            fontFamily="Work sans"
            textTransform="uppercase"
            textAlign="center"
          >
            {user.username}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Image
              borderRadius="50%"
              w={150}
              src={user.avatar}
              alt="Dan Abramov"
            />
            <Text fontSize="lg">{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
