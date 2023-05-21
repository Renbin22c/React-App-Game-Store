import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Box,
  Textarea,
  Radio,
  RadioGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { updateProduct } from "../../../api/product";
import { GetToken } from "../../../utils/helper";
import Swal from "sweetalert2";
import { useQueryClient, useMutation } from "react-query";

export function EditProduct({ product, onClose, isOpen }) {
  const token = GetToken();
  const [editProduct, setEditProduct] = useState(product);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    `http://localhost:5678${product.image.replace("image", "")}`
  );
  const queryClient = useQueryClient();

  const onChangeHandler = (e) =>
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setImage(e.target.files[0]);
  };

  const { mutate } = useMutation(updateProduct, {
    onSuccess: (data) => {
      Swal.fire("Success", data.msg, "success");
      queryClient.invalidateQueries("products");
      onClose();
    },
    onError: (error) => {
      Swal.fire("Oops...", error.response.data.msg, "error");
      onClose();
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    mutate({ editProduct, image, token });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmitHandler}>
          <ModalCloseButton />
          <ModalHeader lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Edit Product
          </ModalHeader>
          <ModalBody>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                _placeholder={{ color: "gray.500" }}
                type="text"
                name="name"
                onChange={onChangeHandler}
                value={editProduct.name}
              />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="description"
                _placeholder={{ color: "gray.500" }}
                type="text"
                name="description"
                onChange={onChangeHandler}
                value={editProduct.description}
              />
            </FormControl>
            <HStack>
              <Box>
                <FormControl id="type" isRequired>
                  <FormLabel>Type</FormLabel>
                  <Input
                    placeholder="Type"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    name="type"
                    onChange={onChangeHandler}
                    value={editProduct.type}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="status" isRequired>
                  <FormLabel>Status</FormLabel>
                  <RadioGroup defaultValue={editProduct?.status + ""}>
                    <Stack direction="row">
                      <Radio
                        name="status"
                        value="true"
                        onChange={onChangeHandler}
                      >
                        Active
                      </Radio>
                      <Radio
                        name="status"
                        value="false"
                        onChange={onChangeHandler}
                      >
                        Unactive
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Box>
            </HStack>
            <HStack>
              <Box>
                <FormControl id="price" isRequired>
                  <FormLabel>Price</FormLabel>
                  <Input
                    placeholder="Price"
                    _placeholder={{ color: "gray.500" }}
                    type="number"
                    name="price"
                    onChange={onChangeHandler}
                    value={editProduct.price}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="rating" isRequired>
                  <FormLabel>Rating</FormLabel>

                  <Input
                    placeholder="Rate"
                    _placeholder={{ color: "gray.500" }}
                    type="number"
                    name="rating"
                    min={0}
                    max={5}
                    onChange={onChangeHandler}
                    value={editProduct.rating}
                  />
                </FormControl>
              </Box>
            </HStack>
            <HStack>
              <Box>
                <FormControl id="developer" isRequired>
                  <FormLabel>Developer</FormLabel>
                  <Input
                    placeholder="Developer"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    name="developer"
                    onChange={onChangeHandler}
                    value={editProduct.developer}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="publisher" isRequired>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    placeholder="Publisher"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    name="publisher"
                    onChange={onChangeHandler}
                    value={editProduct.publisher}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="release_time" isRequired>
              <FormLabel>Realese Time</FormLabel>
              <Input
                placeholder="Select Date"
                size="md"
                type="date"
                name="release_time"
                onChange={onChangeHandler}
                value={editProduct.release_time}
              />
            </FormControl>
            <FormControl id="video" isRequired>
              <FormLabel>Video Url</FormLabel>
              <Input
                placeholder="mysite"
                _placeholder={{ color: "gray.500" }}
                name="video"
                type="url"
                onChange={onChangeHandler}
                value={editProduct.video}
              />
            </FormControl>
            <FormControl id="image" isRequired>
              <FormLabel>Image</FormLabel>
              <Flex align="center">
                <Box
                  borderWidth={1}
                  borderStyle="dashed"
                  borderColor="gray.400"
                  px={4}
                  py={6}
                  rounded="md"
                  w="full"
                  textAlign="center"
                  cursor="pointer"
                  transition="border 0.3s ease"
                  _hover={{ borderColor: "blue.400" }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Box fontSize="sm" color="gray.600" textAlign="center">
                      {selectedImage ? (
                        <img src={selectedImage} alt="Selected" />
                      ) : (
                        "Select an image"
                      )}
                    </Box>
                  </Stack>
                  <Input
                    type="file"
                    opacity={0}
                    position="absolute"
                    width="100%"
                    top={8}
                    left={0}
                    bottom={0}
                    right={0}
                    size="xl"
                    onChange={handleImageSelect}
                    isRequired={false}
                  />
                </Box>
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                type="submit"
              >
                Save
              </Button>
            </Stack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
