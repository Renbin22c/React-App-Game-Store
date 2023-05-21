import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, //24hrs
    },
  },
  persistCache: localStoragePersistor,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </ChakraProvider>
);
