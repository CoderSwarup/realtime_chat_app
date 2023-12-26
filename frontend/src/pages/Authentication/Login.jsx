import React, { useState } from "react";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Add your logic for handling the sign-in process
    console.log("Email:", email);
    console.log("Password:", password);
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
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading as="h2" size="xl">
              Log in to your account
            </Heading>
            <Text color="fg.muted">Chat Securely</Text>
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
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
            <HStack justify="space-between">
              <Checkbox>Remember me</Checkbox>
              <Button variant="text" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button colorScheme="blue" onClick={handleSignIn}>
                Sign in
              </Button>
            </Stack>
            <Divider />
            <Text color="fg.muted" align="right">
              Don't have an account? <Link href="#">Sign up</Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
