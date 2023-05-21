import React from "react";
import { getUserById } from "../../api/user";
import { useQuery } from "react-query";
import { PacmanLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Box,
  Text,
  Badge,
  Button,
  Tooltip,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { getStorage } from "../../api/storage";
import { StorageItem } from "./StorageItem";

export function Storage() {
  const grayColor = useColorModeValue("gray.700", "gray.400");
  const gray2Color = useColorModeValue("gray.50", "gray.800");
  const whiteColor = useColorModeValue("white", "gray.900");

  const redirect = useNavigate();
  const { data: user, isLoading: userLoading } = useQuery("user", () =>
    getUserById({
      id: localStorage.getItem("user"),
      token: localStorage.getItem("token"),
    })
  );

  const { data: storage, isLoading: storageLoading } = useQuery("storage", () =>
    getStorage(localStorage.getItem("token"))
  );

  if (userLoading || storageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  return (
    <Stack direction={{ base: "column", md: "row" }} minH="100vh">
      <Flex p={2} flex={0.6} align="center" justify="center">
        <Center py={2}>
          <Box
            maxW="320px"
            w="full"
            bg={whiteColor}
            boxShadow="lg"
            rounded="lg"
            p={6}
            textAlign="center"
            position="relative"
          >
            <Avatar
              size="xl"
              alt="Avatar Alt"
              mb={4}
              pos="relative"
              src={
                user?.image
                  ? `http://localhost:5678${user?.image.replace("image", "")}`
                  : ""
              }
            />
            <Box position="absolute" top={2} right={2}>
              <Tooltip label="Edit Profile">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => redirect(`/profile`, { state: user })}
                >
                  <EditIcon />
                </Button>
              </Tooltip>
            </Box>
            <Heading fontSize="2xl" fontFamily="body">
              {user?.username}
            </Heading>
            <Text fontWeight={600} color="gray.500" mb={4}>
              {user?.email}
            </Text>
            <Text textAlign="center" color={grayColor} px={3}>
              {user?.introduce || "-"}
            </Text>

            <Stack direction="row" mt={6} spacing={2}>
              <Badge px={2} py={1} bg={gray2Color} fontWeight={400}>
                {user?.country || "-"}
              </Badge>
              <Badge px={2} py={1} bg={gray2Color} fontWeight={400}>
                {user?.birthday || "-"}
              </Badge>
              <Badge px={2} py={1} bg={gray2Color} fontWeight={400}>
                {user?.gender || "-"}
              </Badge>
            </Stack>
          </Box>
        </Center>
      </Flex>
      {storage?.items ? (
        <>
          <Flex flex={1.4} p={2}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} className="flex">
              {storage?.items.map((product) => (
                <GridItem key={product._id}>
                  <StorageItem product={product} />
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </>
      ) : (
        <>
          <Text
            className="flex justify-center items-center h-screen"
            fontSize="xl"
          >
            Your Storage is empty
          </Text>
        </>
      )}
    </Stack>
  );
}
