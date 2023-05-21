import React from "react";
import {
  Avatar,
  chakra,
  Flex,
  useColorModeValue,
  Box,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteComment } from "../../api/comment";
import { GetToken } from "../../utils/helper";
import { useQueryClient, useMutation } from "react-query";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

export function Comment({ comment }) {
  const graycolor = useColorModeValue("gray.100", "gray.900");
  const token = GetToken();
  const decoded = token ? jwt_decode(token) : null;
  const queryClient = useQueryClient();

  const { mutate } = useMutation(deleteComment, {
    onSuccess: (data) => {
      Swal.fire("Deleted!", "Your comment has been deleted.", "success");
      queryClient.invalidateQueries("comments");
    },
    onError: (error) => {
      Swal.fire("Oops", "Fail to delete", "error");
    },
  });

  const deleteHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate({ id, token });
      }
    });
  };

  return (
    <Flex
      boxShadow={"lg"}
      maxW={"640px"}
      direction={{ base: "column-reverse", md: "row" }}
      rounded={"xl"}
      p={10}
      justifyContent={"space-between"}
      position={"relative"}
      bg={graycolor}
    >
      <Flex
        direction={"column"}
        textAlign={"left"}
        justifyContent={"space-between"}
      >
        <chakra.p
          fontFamily={"Inter"}
          fontWeight={"medium"}
          fontSize={"20px"}
          pb={4}
        >
          {comment.content}
        </chakra.p>
        <chakra.p fontFamily={"Work Sans"} fontWeight={"bold"} fontSize={14}>
          {comment.user.username}
        </chakra.p>
      </Flex>
      <Flex alignItems="center" ml={{ base: 0, md: 5 }}>
        <Avatar
          height={"80px"}
          width={"80px"}
          alignSelf={"center"}
          m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
          src={
            comment?.user?.image === null
              ? ""
              : `http://localhost:5678${comment?.user?.image.replace(
                  "image",
                  ""
                )}`
          }
        />

        {token && comment.user._id === decoded.data._id ? (
          <Box position="absolute" top={3} right={2}>
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => deleteHandler(comment._id)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
}
