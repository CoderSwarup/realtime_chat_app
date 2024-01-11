import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Input,
  useToast,
  ListItem,
  Badge,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./Modals/ProfileModal";
import ChatLoading from "./ChatLoading";
import { LogOutUser, SearchUsers } from "../../Store/Actions/UserActions";
import { useNavigate } from "react-router-dom";
import UserListItem from "./UserListItem";
import "./Chat.style.css";
import { FetchMyChats, accessNewChat } from "../../Store/Actions/ChatActions";
import { getSender } from "../../config/ChatLogics";
import { setSelectedChat } from "../../Store/Slice/ChatSlice";
import { removeNotification } from "../../Store/Slice/Notificationslice";

export default function SideDrawer() {
  const { user } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notification);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("left");

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  // My State
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingSearchResult, setLoadingSearchResult] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const toast = useToast();

  const HandleSearch = async () => {
    if (search === undefined || search === "") {
      return toast({
        title: "Please Enter Something In Search.",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }

    const result = await SearchUsers(search, setLoadingSearchResult, toast);

    setSearchResult(result.Users);
  };

  const handleFunction = async (userId) => {
    setIsDisable(true);
    const Access = await accessNewChat({ userId });
    // console.log(Access);
    dispatch(FetchMyChats());
    setIsDisable(false);
  };

  const LogOutHandler = () => {
    dispatch(LogOutUser({ Navigate }));
  };
  return (
    <Box
      p="5px 10px"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Tooltip label="Search User To Chat">
        <Button onClick={onOpen}>
          <span className="material-symbols-outlined">search</span>{" "}
          <Box display={{ base: "none", md: "flex" }} p="2px" fontSize="lg">
            Search
          </Box>
        </Button>
      </Tooltip>

      <Text fontSize="2xl" fontWeight="700">
        TALK LIVE
      </Text>

      <div className="right-side-drawer">
        <Menu>
          <MenuButton
            borderRadius="50%"
            _hover={{
              background: "#0000005a",
              color: "#fff",
            }}
            p={1}
            position="relative"
          >
            <BellIcon fontSize="2xl" />
            {notifications.length > 0 && (
              <Badge
                position="absolute"
                top={1}
                right={1}
                background="#ff0000"
                color="#fff"
                fontSize="12px"
              >
                {notifications.length}
              </Badge>
            )}
          </MenuButton>
          <MenuList
            padding="3px"
            textAlign="center"
            background="#242424"
            color="#fff"
          >
            {notifications.length > 0 ? (
              <>
                {notifications.map((notif) => (
                  <MenuItem
                    background="#000000"
                    color="#fff"
                    key={notif._id}
                    onClick={() => {
                      dispatch(setSelectedChat(notif.chat));
                      dispatch(removeNotification(notif));
                    }}
                  >
                    <>
                      <Text fontWeight="600" mr="4px">
                        {notif.content.length > 10
                          ? `${notif.content.slice(0, 10)}...`
                          : notif.content}
                      </Text>
                      {notif.chat.isGroupChat
                        ? `  From ${notif.chat.chatName}`
                        : `   From ${notif.sender.username}`}
                    </>
                  </MenuItem>
                ))}
              </>
            ) : (
              <span>No Notification Yet</span>
            )}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            background="transparent"
            color="#fff"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            _hover={{
              background: "#00000043",
              color: "#fff",
            }}
          >
            <Avatar
              background="#fff"
              size="sm"
              cursor="pointer"
              objectFit="cover"
              name={user.user.username}
              src={user.user.avatar}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user.user}>
              <MenuItem color="#000">My Profile</MenuItem>
            </ProfileModal>

            <MenuDivider />
            <MenuItem onClick={LogOutHandler} color="#000">
              LogOut
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      {/* Drawer */}
      <Drawer
        background="#000"
        placement={placement}
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent background="#242424" color="#fff">
          <DrawerHeader borderBottomWidth="1px">
            <Box display="flex" justifyContent="center" alignItems="center">
              Search User
              <Button
                ml="auto"
                onClick={onClose}
                background="transparent"
                color="#fff"
                _hover={{ background: "#242424" }}
              >
                <CloseIcon />
              </Button>
            </Box>
            <Box mt="5px" display="flex" paddingBottom="4px">
              <Input
                htmlSize={4}
                placeholder="Search By name Or Email"
                mr={3}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={HandleSearch}
                background="transparent"
                color="#fff"
                _hover={{ background: "#242424" }}
              >
                <Search2Icon></Search2Icon>
              </Button>
            </Box>
          </DrawerHeader>
          <DrawerBody p={2} className="SearchResult-container">
            {!loadingSearchResult ? (
              <>
                {searchResult.map((currentUser, i) => {
                  return (
                    <UserListItem
                      key={currentUser._id}
                      user={currentUser}
                      handleFunction={() => {
                        if (!isDisable) {
                          handleFunction(currentUser._id);
                        }
                      }}
                    />
                  );
                })}
              </>
            ) : (
              <ChatLoading></ChatLoading>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
