import { Box, Text } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const Chatbox = () => {
  const { selectedChat } = useSelector((s) => s.chats);
  return (
    <Box
      className="ChatBoxCantainer"
      // d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      h="91vh"
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#242424"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {selectedChat ? (
        <SingleChat />
      ) : (
        <Box w="100%" h="100%" display="grid" placeItems="center">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Chatbox;
