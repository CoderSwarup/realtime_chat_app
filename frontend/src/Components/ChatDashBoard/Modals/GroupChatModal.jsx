import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Box,
  useToast,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import UserListItem from "../UserListItem";
import UserBadgeItem from "../UserBadgeItem";
import { SearchUsers } from "../../../Store/Actions/UserActions";
import { Search2Icon } from "@chakra-ui/icons";
import {
  FetchMyChats,
  createGroupChat,
} from "../../../Store/Actions/ChatActions";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../../Store/Slice/ChatSlice";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchquery, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const FetchAgainData = () => {
    dispatch(FetchMyChats());
    dispatch(setSelectedChat(null));
    onClose();
  };

  const handleGroup = (userToAdd) => {
    // console.log(selectedUsers);
    // console.log(userToAdd);

    // Check if userToAdd is already in selectedUsers based on user ID
    const isUserAlreadyAdded = selectedUsers.some(
      (user) => user._id === userToAdd._id
    );

    if (isUserAlreadyAdded) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleSearch = async () => {
    if (searchquery === "" || !searchquery) {
      toast({
        title: "Please Search User By Name Or Email",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setSearchResult([]);
      return;
    }
    const Result = await SearchUsers(searchquery, setLoading, toast);
    // console.log(Result);
    setSearchResult(Result.Users);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast({
        title: "Group Chats must have at least two members.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Add your logic for creating a group chat using groupChatName and selectedUsers
    await createGroupChat(groupChatName, selectedUsers, toast, FetchAgainData);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search2Icon></Search2Icon>
              </Button>
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Box w="100%" display="flex" justifyContent="center">
                <Spinner size="lg" />
              </Box>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
