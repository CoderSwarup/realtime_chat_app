import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

export default function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      background="transparent"
      _hover={{
        background: "#000",
        color: "#fff",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      gap="5px"
      borderRadius="lg"
      p="4px 6px"
      mb={2}
    >
      <Avatar
        background="#fff"
        size="sm"
        cursor="pointer"
        objectFit="cover"
        name={user?.username}
        src={user?.avatar}
      />

      <Box>
        <Text fontWeight="bold">{user?.username}</Text>
        <Text>{user?.email}</Text>
      </Box>
    </Box>
  );
}
