import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export function StorageItem({ product }) {
  const grayColor = useColorModeValue("gray.100", "gray.700");
  const whiteColor = useColorModeValue("white", "gray.900");
  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      shadow="md"
      bg={whiteColor}
      className="my-4 mx-4"
    >
      <Flex align="center" justify="space-between" p={4} bg={grayColor}>
        <Heading as="h3" size="md">
          {product.product.name}
        </Heading>
      </Flex>
      <Box p={4}>
        <Image
          src={`http://localhost:5678${product.product?.image?.replace(
            "image",
            ""
          )}`}
          alt={product.product.name}
          borderRadius="md"
          w="100%"
          h={200}
          objectFit="cover"
        />
        <VStack spacing={2} mt={4}>
          <Text fontWeight="bold">Purchase Date:</Text>
          <Text>{product.purchasedAt.slice(0, 10)}</Text>
        </VStack>
      </Box>
    </Box>
  );
}
