import React, { useState } from "react";
import { useQuery } from "react-query";
import { getProducts } from "../../api/product";
import Products from "./Products";
import { PacmanLoader } from "react-spinners";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
} from "@chakra-ui/react";
import "./ProductsList.css";

export function ProductList() {
  const { data, isLoading } = useQuery("products", getProducts);
  const [type, setType] = useState("All");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  return (
    <div className="container my-8">
      <Tabs isFitted variant="enclosed" defaultIndex={2}>
        <TabList mb="1em" maxH="4em">
          <Tab onClick={() => setType("Open World")}>Open World</Tab>
          <Tab onClick={() => setType("Sports")}>Sports</Tab>
          <Tab onClick={() => setType("All")}>All</Tab>
          <Tab onClick={() => setType("Role Playing")}>Role Playing</Tab>
          <Tab onClick={() => setType("Horror")}>Horror</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid templateColumns="repeat(3, 1fr)">
              {data?.map((product) => {
                if (product.status) {
                  if (product.type === type) {
                    return <Products key={product._id} product={product} />;
                  }
                  return null;
                }
                return null;
              })}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid templateColumns="repeat(3, 1fr)">
              {data?.map((product) => {
                if (product.status) {
                  if (product.type === type) {
                    return <Products key={product._id} product={product} />;
                  }
                  return null;
                }
                return null;
              })}
            </Grid>
          </TabPanel>
          <TabPanel>
            <div className="grid-container">
              {data?.map((product) => {
                if (product.status) {
                  return <Products key={product._id} product={product} />;
                }
                return null;
              })}
            </div>
          </TabPanel>
          <TabPanel>
            <Grid templateColumns="repeat(3, 1fr)">
              {data?.map((product) => {
                if (product.status) {
                  if (product.type === type) {
                    return <Products key={product._id} product={product} />;
                  }
                  return null;
                }
                return null;
              })}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid templateColumns="repeat(3, 1fr)">
              {data?.map((product) => {
                if (product.status) {
                  if (product.type === type) {
                    return <Products key={product._id} product={product} />;
                  }
                  return null;
                }
                return null;
              })}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
