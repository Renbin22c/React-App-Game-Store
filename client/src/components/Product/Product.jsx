import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, likeProduct } from "../../api/product";
import { addToCart } from "../../api/cart";
import { getStorage } from "../../api/storage";
import { getCart } from "../../api/cart";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { StarIcon } from "@chakra-ui/icons";
import { PacmanLoader } from "react-spinners";
import { CommentList } from "../Comment/CommentList";
import { AddComment } from "../Form/AddCommentForm";
import { GetToken } from "../../utils/helper";
import Swal from "sweetalert2";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import jwt_decode from "jwt-decode";

export function ProductId() {
  const gray1color = useColorModeValue("gray.900", "gray.400");
  const gray2color = useColorModeValue("gray.200", "gray.600");
  const gray3color = useColorModeValue("gray.900", "gray.50");
  const yellowcolor = useColorModeValue("yellow.500", "yellow.300");
  const whitecolor = useColorModeValue("white", "gray.900");

  const token = GetToken();
  const { id } = useParams();
  const { data, isLoading } = useQuery("products", () => getProductById(id));
  const { data: cart, isLoading: cartLoading } = useQuery("cart", () =>
    getCart(localStorage.getItem("token"))
  );
  const { data: storage, isLoading: storageLoading } = useQuery("storage", () =>
    getStorage(localStorage.getItem("token"))
  );
  const [addComment, setAddComment] = useState(false);
  const queryClient = useQueryClient();
  const decode = localStorage.getItem("token")
    ? jwt_decode(localStorage.getItem("token"))
    : null;

  const { mutate: likeMutate } = useMutation(likeProduct, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
    },
    onError: (err) => {
      Swal.fire("Oops...", err.response.data.msg, "error");
    },
  });

  const likeHandler = (id) => {
    likeMutate({ id, token });
  };

  const { mutate: cartMutate } = useMutation(addToCart, {
    onSuccess: (data) => {
      Swal.fire("Success", data.msg, "success");
      queryClient.invalidateQueries("cart");
    },
    onError: (error) => {
      alert(error.response.data.msg);
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    cartMutate({ id, token });
  };

  if (isLoading || cartLoading || storageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  let liker = data?.likes?.find(
    (like) => like?.like?.user === decode?.data._id
  );
  let cartItem = cart?.items?.find((item) => item?.product?._id === data?._id);
  let storageItem = storage?.items?.find(
    (item) => item?.product?._id === data?._id
  );

  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Stack>
            <Image
              rounded={"md"}
              alt={data?.name}
              src={`http://localhost:5678${data?.image.replace("image", "")}`}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "300px", lg: "300px" }}
            />
            <Box
              as="iframe"
              src={data?.video}
              width="100%"
              sx={{
                aspectRatio: "16/9",
              }}
            />
          </Stack>
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {data?.name}
            </Heading>
            <Text color={gray1color} fontWeight={300} fontSize={"2xl"}>
              RM {data?.price}
            </Text>
          </Box>
          <Box display="flex" mt="2" alignItems="center">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < data?.rating ? "teal.500" : "gray.300"}
                  fontSize="xl"
                />
              ))}
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={<StackDivider borderColor={gray2color} />}
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text fontSize={"lg"}>{data?.description}</Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={yellowcolor}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Game Details
              </Text>

              <List spacing={2}>
                <ListItem>
                  <Text as={"span"} fontWeight={"bold"}>
                    Developer :
                  </Text>{" "}
                  {data?.developer}
                </ListItem>
                <ListItem>
                  <Text as={"span"} fontWeight={"bold"}>
                    Publisher :
                  </Text>{" "}
                  {data?.publisher}
                </ListItem>
                <ListItem>
                  <Text as={"span"} fontWeight={"bold"}>
                    Type :
                  </Text>{" "}
                  {data?.type}
                </ListItem>
                <ListItem>
                  <Text as={"span"} fontWeight={"bold"}>
                    Release Time :
                  </Text>{" "}
                  {data?.release_time}
                </ListItem>
              </List>
            </Box>
          </Stack>

          {token && decode.data.isAdmin === false ? (
            <>
              <form onSubmit={onSubmitHandler}>
                <Button
                  rounded={"none"}
                  w={"full"}
                  mt={8}
                  size={"lg"}
                  py={"7"}
                  bg={gray3color}
                  color={whitecolor}
                  textTransform={"uppercase"}
                  _hover={{
                    transform: "translateY(2px)",
                    boxShadow: "lg",
                  }}
                  type="submit"
                >
                  {storageItem?.product?._id === data._id
                    ? "You already have this game in Storage"
                    : cartItem?.product?._id === data._id
                    ? "You already add this game to cart"
                    : "Add to cart"}
                </Button>
              </form>
              <Button w="50%" onClick={() => setAddComment(true)}>
                Add Comment
              </Button>
              <Flex>
                <Button w="8%" onClick={() => likeHandler(data?._id)}>
                  {liker?.like?.user === decode?.data?._id ? (
                    <AiTwotoneLike />
                  ) : (
                    <AiOutlineLike />
                  )}
                </Button>
                <div className="ml-4 mt-2">{data?.likes?.length} Like</div>
              </Flex>
            </>
          ) : null}
          {addComment ? (
            <AddComment setAddComment={setAddComment} productId={data?._id} />
          ) : null}
        </Stack>
      </SimpleGrid>

      <Stack>
        <CommentList productId={data?._id} />
      </Stack>
    </Container>
  );
}
