import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  RadioGroup,
  Radio,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  HStack,
  Box,
} from "@chakra-ui/react";
import { GetToken } from "../../utils/helper";
import { userUpdate } from "../../api/user";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

export function Profile() {
  const location = useLocation();
  const data = location.state;

  const redirect = useNavigate();
  const token = GetToken();

  const grayColor = useColorModeValue("gray.50", "gray.800");
  const whiteColor = useColorModeValue("white", "gray.700");

  const [updateUser, setUpdateUser] = useState(data);
  // const [value, setValue] = useState(null);

  const [image, setImage] = useState({});
  const queryClient = useQueryClient();

  const { mutate } = useMutation(userUpdate, {
    onSuccess: (data) => {
      Swal.fire("Updated", data.msg, "success");
      queryClient.invalidateQueries("user");
    },
    onError: (error) => {
      Swal.fire("Oops", error.response.data.msg, "error");
    },
  });

  const onChangeHandler = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    mutate({ updateUser, image, token });
    redirect("/storage");
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={grayColor}>
      <form onSubmit={onSubmitHandler}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={whiteColor}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>

          <FormControl id="userName">
            <FormLabel>User Image</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  src={
                    updateUser?.image
                      ? `http://localhost:5678${updateUser?.image.replace(
                          "image",
                          ""
                        )}`
                      : ""
                  }
                ></Avatar>
              </Center>
              <Center w="full">
                <Button w="full" size="sm" onClick={imageHandler}>
                  <FormControl id="image">
                    <input
                      type="file"
                      onChange={imageHandler}
                      accept="image/*"
                    />
                  </FormControl>
                </Button>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={updateUser?.username}
              name="username"
              onChange={onChangeHandler}
            />
          </FormControl>
          <FormControl id="introduce" isRequired>
            <FormLabel>Introduce</FormLabel>
            <Input
              placeholder="Introduce"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={updateUser?.introduce}
              name="introduce"
              onChange={onChangeHandler}
            />
          </FormControl>
          <FormControl id="country" isRequired>
            <FormLabel>Country</FormLabel>
            <Input
              placeholder="Country"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={updateUser?.country}
              name="country"
              onChange={onChangeHandler}
            />
            {/* <CountrySelect value={value} onChange={setValue} /> */}
          </FormControl>
          <HStack>
            <Box>
              <FormControl id="birthday" isRequired>
                <FormLabel>Birthday</FormLabel>
                <Input
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  value={updateUser?.birthday}
                  name="birthday"
                  onChange={onChangeHandler}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="gender" isRequired>
                <FormLabel>Gender</FormLabel>
                <RadioGroup defaultValue={updateUser?.gender}>
                  <Stack direction="row">
                    <Radio
                      name="gender"
                      value="Male"
                      onChange={onChangeHandler}
                    >
                      Male
                    </Radio>
                    <Radio
                      name="gender"
                      value="Female"
                      onChange={onChangeHandler}
                    >
                      Female
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Box>
          </HStack>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={() => redirect(`/storage`)}
            >
              Cancel
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </form>
    </Flex>
  );
}
