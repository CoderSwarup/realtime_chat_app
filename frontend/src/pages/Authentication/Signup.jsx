import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "../../Components/PasswordField";
import { Logo } from "../../Components/Logo";
import React, { useState } from "react";
import FileUpload from "../../Components/FileUpload";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFileUpload = (files) => {
    // Handle the files, e.g., upload them to a server
    console.log(files, username, email, password, confirmPassword);
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Flex m="auto">
            <Center>
              <Logo />
            </Center>

            <Heading ml="5px" as="h2" size="xl" w="100%">
              Talk Live
            </Heading>
          </Flex>
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading as="h2" size="xl">
              Create an account
            </Heading>
            <Text color="fg.muted">Start your Chatting journey</Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={{ base: "transparent", sm: "bg.surface" }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordField
                name="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <FormControl>
                <FormLabel htmlFor="email">Upload Avatar</FormLabel>
                <FileUpload onFileUpload={handleFileUpload} />
              </FormControl>
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="text" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button colorScheme="blue">Sign up</Button>
            </Stack>
            <Divider></Divider>
            <Text color="fg.muted" align="right">
              Already have an account? <Link href="#">Log in</Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
