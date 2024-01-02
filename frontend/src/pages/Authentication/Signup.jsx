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
import { useToast } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Signup() {
  const toast = useToast();
  const Navigator = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  //Image / Profile images Handler
  const handleFileUpload = (url) => {
    setUploadedFile(url);
    // console.log("URL IS", url);
    // Handle the files, e.g., upload them to a server
  };

  // Clear Input Function
  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUploadedFile(null);
  };

  // Send Data To backend And The Validation
  const submitHandler = async () => {
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
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
        "/api/v1/user/register",
        {
          username,
          email,
          password,
          avatar: uploadedFile,
        },
        config
      );
      // console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      Navigator("/login");
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
                <FileUpload
                  setLoading={setLoading}
                  onFileUpload={handleFileUpload}
                />
                {uploadedFile && (
                  <Flex m="auto" w="100%">
                    <Center m="auto" mt="5px">
                      <img
                        width="50px"
                        src={uploadedFile}
                        alt="Uploaded File"
                      />
                    </Center>
                  </Flex>
                )}
              </FormControl>
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="text" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button
                isDisabled={isLoading}
                onClick={submitHandler}
                colorScheme="blue"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined loading">
                    progress_activity
                  </span>
                ) : (
                  <span> Sign up</span>
                )}
              </Button>
            </Stack>
            <Divider></Divider>
            <Text color="fg.muted" align="right">
              Already have an account? <NavLink to="/login">Log in</NavLink>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
