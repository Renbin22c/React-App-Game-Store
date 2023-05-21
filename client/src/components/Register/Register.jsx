import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { userRegister } from "../../api/user";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const { mutate, isLoading } = useMutation(userRegister, {
    onSuccess: (data) => {
      let timerInterval;
      Swal.fire({
        title: "Register Successfully",
        html: "Going to Login Page",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((res) => {
        if (res.dismiss === Swal.DismissReason.timer) {
          navigate("/login");
        }
      });
    },
    onError: (error) => {
      Swal.fire("Failed to register", error.response.data.msg, "error");
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (user.password !== user.password2) {
      Swal.fire("Oops...", "Password doesnt match", "error");
      return;
    }
    mutate(user);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <form onSubmit={onSubmitHandler}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            onSubmit={onSubmitHandler}
          >
            <Stack spacing={4}>
              <FormControl id="Username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" name="username" onChange={onChangeHandler} />
              </FormControl>
              <FormControl id="Email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" onChange={onChangeHandler} />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="Password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={onChangeHandler}
                      />
                      <InputRightElement h={"full"}>
                        <Button
                          variant={"ghost"}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="Password2" isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword2 ? "text" : "password"}
                        name="password2"
                        onChange={onChangeHandler}
                      />
                      <InputRightElement h={"full"}>
                        <Button
                          variant={"ghost"}
                          onClick={() =>
                            setShowPassword2((showPassword2) => !showPassword2)
                          }
                        >
                          {showPassword2 ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
              </HStack>
              <Stack spacing={10} pt={2}>
                <Tooltip label="Register">
                  <Button type="submit" size={"lg"}>
                    {isLoading ? <Spinner /> : "Sign Up"}
                  </Button>
                </Tooltip>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already have a user ?{" "}
                  <Link color={"blue.400"} href="/login">
                    Sign In
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}
