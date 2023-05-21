import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { getUserById } from "../api/user";

export default function Topnav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const graycolor = useColorModeValue("gray.100", "gray.900");

  const queryClient = useQueryClient();
  const redirect = useNavigate();

  const { data } = useQuery("getToken", () => localStorage.getItem("token"));
  const { data: user } = useQuery("user", () =>
    getUserById({
      id: localStorage.getItem("user"),
      token: localStorage.getItem("token"),
    })
  );

  const logout = () => {
    Swal.fire("Logout", "", "success");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.invalidateQueries("getToken");
    redirect("/login");
  };

  return (
    <>
      <Box bg={graycolor} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Tooltip label="Main Page">
            <Link href="/">
              <Box>Game Store</Box>
            </Link>
          </Tooltip>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? (
                  <>
                    <Tooltip label="Dark Mode">
                      <MoonIcon />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip label="Light Mode">
                      <SunIcon />
                    </Tooltip>
                  </>
                )}
              </Button>

              {data ? (
                user?.isAdmin === true ? (
                  <>
                    <Menu>
                      <MenuButton as={Button}>DashBoard</MenuButton>
                      <MenuList>
                        <Link href="/product_dashboard">
                          <MenuItem>Product Dashboard</MenuItem>
                        </Link>
                        <Link href="/user_dashboard">
                          <MenuItem>User Dashboard</MenuItem>
                        </Link>
                      </MenuList>
                    </Menu>
                  </>
                ) : null
              ) : null}

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      data
                        ? user?.image
                          ? `http://localhost:5678${user?.image.replace(
                              "image",
                              ""
                            )}`
                          : "https://avatars.dicebear.com/api/male/username.svg"
                        : "https://avatars.dicebear.com/api/male/username.svg"
                    }
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={
                        data
                          ? user?.image
                            ? `http://localhost:5678${user?.image.replace(
                                "image",
                                ""
                              )}`
                            : "https://avatars.dicebear.com/api/male/username.svg"
                          : "https://avatars.dicebear.com/api/male/username.svg"
                      }
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>
                      {data
                        ? user?.username
                          ? `${user?.username}`
                          : "Username"
                        : "Username"}
                    </p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {!data ? (
                    <>
                      <Link href="/register">
                        <MenuItem>Register</MenuItem>
                      </Link>
                      <Link href="/login">
                        <MenuItem>Login</MenuItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      {user?.isAdmin === false ? (
                        <>
                          <Link href="/storage">
                            <MenuItem>Your Storage</MenuItem>
                          </Link>
                          <Link href="/cart">
                            <MenuItem>Your Cart</MenuItem>
                          </Link>
                        </>
                      ) : null}
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
