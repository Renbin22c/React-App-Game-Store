import React from "react";
import {
  Box,
  Image,
  Link,
  Tooltip,
  GridItem,
  Badge,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import "./ProductsList.css";

export default function Products({ product }) {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  return (
    <GridItem my={4} w={{ base: "100%", md: "400px" }} className="product">
      <Box boxShadow="md" borderRadius="md" overflow="hidden" bg={bgColor}>
        <Image
          src={`http://localhost:5678${product?.image?.replace("image", "")}`}
          alt={product.name}
          w="100%"
          h="200px"
          objectFit="cover"
        />
        <Box p={4}>
          <Tooltip label="Product details">
            <Link
              href={`/product/${product._id}`}
              fontWeight="semibold"
              noOfLines={2}
              fontSize="xl"
            >
              {product.name}
            </Link>
          </Tooltip>

          <Flex justify="space-between" align="center" mt={2}>
            <Box>
              <Badge
                colorScheme="teal"
                borderRadius="full"
                px={2}
                py={1}
                mb={2}
              >
                RM {product.price}
              </Badge>
            </Box>
            <Box display="flex" alignItems="center">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < product.rating ? "teal.500" : "gray.300"}
                    boxSize={5}
                  />
                ))}
            </Box>
          </Flex>
        </Box>
      </Box>
    </GridItem>
  );
}
