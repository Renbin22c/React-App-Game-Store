import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Text,
  Link,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { userLogin } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";

export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const redirect = useNavigate();

  const { mutate, isLoading } = useMutation(userLogin, {
    onSuccess: (data) => {
      let timerInterval;
      Swal.fire({
        title: "Login Successfully",
        html: "Going to Main Page",
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
          if (!localStorage.getItem("token")) {
            localStorage.setItem("token", data.token);
            localStorage.setItem(
              "user",
              JSON.stringify(data.user._id).slice(1, -1)
            );
            queryClient.setQueryData("getToken", data);
          }
          redirect("/");
        }
      });
    },
    onError: (err) => {
      Swal.fire("Failed to Login", err.response.data.msg, "error");
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    mutate(user);
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Sign in to your account</Heading>
          <form onSubmit={onSubmitHandler}>
            <FormControl id="email">
              <FormLabel className="flex">
                <EmailIcon mt={1} mr={1} />
                Email address
              </FormLabel>
              <Input
                type="email"
                name="email"
                onChange={onChangeHandler}
                mb={1}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>
                <LockIcon mb={1} mr={1} />
                Password
              </FormLabel>
              <Input
                type="password"
                name="password"
                onChange={onChangeHandler}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              ></Stack>
              <Tooltip label="Login">
                <Button type="submit" size={"lg"}>
                  {isLoading ? <Spinner /> : "Sign In"}
                </Button>
              </Tooltip>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already have a user ?{" "}
                <Link color={"blue.400"} href="/register">
                  Sign Up
                </Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://media.wired.com/photos/62feb60bcea7c0581e825cb0/4:3/w_2131,h_1598,c_limit/Fate-of-Game-Preservation-Games-GettyImages-1170073827.jpg"
          }
        />
      </Flex>
    </Stack>
  );
}
