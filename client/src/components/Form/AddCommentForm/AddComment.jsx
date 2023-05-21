import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import { useQueryClient, useMutation } from "react-query";
import { commentProduct } from "../../../api/comment";
import { GetToken } from "../../../utils/helper";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

export function AddComment({ setAddComment, productId }) {
  const queryClient = useQueryClient();
  const token = GetToken();
  let decode = jwt_decode(token);

  const [comment, setComment] = useState({
    content: "",
    user: decode.data._id,
  });

  const { mutate } = useMutation(commentProduct, {
    onSuccess: (data) => {
      Swal.fire("Success", data.msg, "success");
      queryClient.invalidateQueries("comments");
    },
    onError: (error) => {
      Swal.fire("Sorry", error.response.data.msg, "error");
    },
  });

  const onChangeHandler = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (comment.content.length === 0) {
      Swal.fire("Sorry", `Please fill up something`, "error");
      return;
    }
    if (token) {
      mutate({ comment, token, id: productId });
    }
    setAddComment(false);
  };

  return (
    <Box
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"lg"}
      p={6}
    >
      <form onSubmit={onSubmitHandler}>
        <Stack spacing={4}>
          <FormControl id="password">
            <FormLabel>Content</FormLabel>
            <Textarea
              type="content"
              name="content"
              onChange={onChangeHandler}
            />
          </FormControl>
          <Stack spacing={2} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              _hover={{
                bg: "red.500",
              }}
              onClick={() => setAddComment(false)}
            >
              Cancel
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
