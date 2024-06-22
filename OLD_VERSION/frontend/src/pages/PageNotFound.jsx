import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
export default function PageNotFound() {
  return (
    <Box w="100%" minH="100vh" textAlign="center" p={8} boxShadow="lg">
      <Heading fontSize="4xl" color="red.500">
        404 - Page Not Found
      </Heading>
      <img
        style={{
          margin: "20px auto  ",
          width: "50%",
          height: "auto",
        }}
        src="/pageNotFound.gif"
        alt="pagenotFound"
      />
      <Text mt={4} fontSize="xl" color="gray.600">
        Oops! It looks like you're lost. The page you are looking for might be
        under construction or doesn't exist.
      </Text>
      <Button
        as={Link}
        to="/"
        colorScheme="teal"
        mt={6}
        px={8}
        py={4}
        borderRadius="lg"
        _hover={{ bg: "teal.500" }}
      >
        Go Home
      </Button>
    </Box>
  );
}
