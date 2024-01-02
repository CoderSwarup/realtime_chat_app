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
  useToast,
} from "@chakra-ui/react";
import { PasswordField } from "../../Components/PasswordField";
import { Logo } from "../../Components/Logo";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const toast = useToast();
  const Navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  // Clear Input Function
  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
  };
  const handleSignIn = async () => {
    // Add your logic for handling the sign-in process
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = await axios.post(
        "/api/v1/user/login",
        {
          email,
          password,
        },
        config
      );
      // console.log(data);
      toast({
        title: "User Login Succefully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      Navigator("/chats");
      clearInputs();
    } catch (error) {
      // console.log(error);
      toast({
        title: "SomeThing Went Wrong",
        description: `${error?.response.data.error || "Error Occured!"}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
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
              <Button
                isDisabled={isLoading}
                colorScheme="blue"
                onClick={handleSignIn}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined loading">
                    progress_activity
                  </span>
                ) : (
                  <span> Log In</span>
                )}
              </Button>
            </Stack>
            <Divider />
            <Text color="fg.muted" align="right">
              Don't have an account?
              <NavLink to="/signup"> Sign up</NavLink>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
