import { Search2Icon, ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";

import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";
import { SearchUsers } from "../../../Store/Actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import {
  AddUserInGroup,
  FetchMyChats,
  ReNameGroup,
  RemoveUserFromGroup,
  leaveGroup,
} from "../../../Store/Actions/ChatActions";
import { setSelectedChat } from "../../../Store/Slice/ChatSlice";
const UpdateGroupChatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure("");
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  //   const { selectedChat, setSelectedChat, user } = ChatState();
  const { selectedChat } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.user);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery === "") {
      setSearchResult([]);
    } else {
      const Result = await SearchUsers(searchQuery, setLoading, toast);
      // console.log(Result);
      setSearchResult(Result.Users);
    }
  };
  const FetchAgainData = () => {
    dispatch(FetchMyChats());
    dispatch(setSelectedChat(null));
  };

  // Handle Rename Grounp
  const handleRename = async () => {
    console.log(selectedChat._id);
    if (!groupChatName || groupChatName === "") {
      return toast({
        title: "Group Name Cannot be empty",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    ReNameGroup(selectedChat._id, groupChatName, toast, FetchAgainData);
  };

  // Add New User
  const handleAddUser = async (selectedUser) => {
    console.log(selectedChat);
    if (selectedChat.users.find((u) => u._id === selectedUser._id)) {
      toast({
        title: "User Already in group!",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    console.log(selectedChat.groupAdmin._id, user.user._id);
    if (selectedChat.groupAdmin._id !== user.user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    AddUserInGroup(selectedChat._id, selectedUser._id, toast, FetchAgainData);
  };

  //Leave Group
  const LeaveGroupHandler = async () => {
    await leaveGroup(selectedChat._id, toast, FetchAgainData);
  };

  // Remove From Group Group
  const handleRemove = async (SelectedUser) => {
    if (selectedChat.groupAdmin._id !== user.user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat.groupAdmin._id === SelectedUser._id) {
      toast({
        title: "Admin Cannot Remove Our Self!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    await RemoveUserFromGroup(
      selectedChat._id,
      SelectedUser._id,
      toast,
      FetchAgainData
    );
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin._id}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
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
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={LeaveGroupHandler} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
