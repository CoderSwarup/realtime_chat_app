import React from "react";
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Flex,
  Box,
  Image,
  IconButton,
  Center,
  Divider,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Logo } from "../Components/PublicComponent/Logo";
export default function Home() {
  return (
    <Box p="10px" minH="100vh">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg="rgba(48, 48, 48, 0.247)"
        backdropFilter="blur(202px)"
        padding="1rem"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="2px"
        >
          <Logo />
          <Text fontSize="xl" fontWeight="bold" color="white">
            TalkLive
          </Text>
        </Box>
        <Flex>
          <Link to="/signup">
            <Button
              variant="ghost"
              color="white"
              mr={4}
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            >
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button
              colorScheme="teal"
              variant="solid"
              _hover={{ bg: "teal.500" }}
            >
              Login
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          textAlign="center"
        >
          Connect and Chat{" "}
          <Text as={"span"} color={"teal.400"}>
            effortlessly
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"} textAlign="center">
          Stay connected and never miss a chat. Keep track of your conversations
          and receive notifications in real-time. Chat effortlessly with your
          friends and explore interesting discussions every day.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Link to="/signup">
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"orange.400"}
              _hover={{ bg: "orange.500" }}
            >
              Get started
            </Button>
          </Link>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>

        <Box width="100%" display="grid" placeItems="center">
          <Image
            src="/HeroPng.jpg"
            alt="hero"
            maxW="600px"
            width="100%"
            height="auto"
          />
        </Box>
      </Stack>

      <Box bg="#202020" color="white" py={4} textAlign="center">
        <Text fontSize="sm" mt={2}>
          © {new Date().getFullYear()} TalkLive App. All rights reserved.
        </Text>
        <Text fontSize="sm">
          Developed by Swarup Bhise{" "}
          <Link to="https://github.com/CoderSwarup">GITHUB</Link>
        </Text>
      </Box>
    </Box>
  );
}
