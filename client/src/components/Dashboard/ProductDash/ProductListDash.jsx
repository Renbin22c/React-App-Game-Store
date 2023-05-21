import React, { useState } from "react";
import { Table } from "react-daisyui";
import { getProducts } from "../../../api/product";
import { useQuery } from "react-query";
import { ProductDash } from "./ProductDash";
import {
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AddProduct } from "../../Form/AddProductForm";

export function ProductListDash() {
  const { data } = useQuery("products", getProducts);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState("All");

  return (
    <div className="overflow-x-auto container">
      <div className="flex justify-between items-center text-3xl font-bold my-6">
        <div className="ml-20 z-20 relative">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Type
            </MenuButton>
            <MenuList>
              <MenuItem
                value="All"
                onClick={() => setSelected("All")}
                fontSize="lg"
              >
                All
              </MenuItem>
              <MenuItem
                value="Open World"
                onClick={() => setSelected("Open World")}
                fontSize="lg"
              >
                Open World
              </MenuItem>
              <MenuItem
                value="Sports"
                onClick={() => setSelected("Sports")}
                fontSize="lg"
              >
                Sports
              </MenuItem>
              <MenuItem
                value="Horror"
                onClick={() => setSelected("Horror")}
                fontSize="lg"
              >
                Horror
              </MenuItem>
              <MenuItem
                value="Role Playing"
                onClick={() => setSelected("Role Playing")}
                fontSize="lg"
              >
                Role Playing
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div>Prodcut List</div>
        <div className="mr-20">
          <Button onClick={onOpen}>Add Product</Button>
        </div>
      </div>
      <AddProduct isOpen={isOpen} onClose={onClose} />
      <Table className="rounded-box ml-20 table-fixed mr-20">
        <Table.Head>
          <span>Product Image</span>
          <span>Name & Type</span>
          <span>Price & Rate</span>
          <span>Description</span>
          <span>Developer & Publisher</span>
          <span>Video URL</span>
          <span>Release Time</span>
          <span>Comments</span>
          <span>Likes</span>
          <span></span>
        </Table.Head>

        <Table.Body>
          {data?.map((product) => {
            if (product.type === selected) {
              return <ProductDash key={product._id} product={product} />;
            } else if (selected === "All") {
              return <ProductDash key={product._id} product={product} />;
            }
          })}
        </Table.Body>

        <Table.Footer>
          <span>Product Image</span>
          <span>Name & Type</span>
          <span>Price & Rate</span>
          <span>Description</span>
          <span>Developer & Publisher</span>
          <span>Video URL</span>
          <span>Release Time</span>
          <span>Comments</span>
          <span>Likes</span>
          <span></span>
        </Table.Footer>
      </Table>
    </div>
  );
}
