import React from "react";
import { Routes, Route } from "react-router-dom";
import Topnav from "./components/Navbar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile/Profile";
import { Storage } from "./components/Storage";
import { ProductList } from "./components/ProductsList/ProductsList";
import { ProductId } from "./components/Product/Product";
import { UserListDash } from "./components/Dashboard/UserDash";
import { ProductListDash } from "./components/Dashboard/ProductDash";
import { Cart } from "./components/Cart";

export default function App() {
  return (
    <>
      <Topnav />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/product/:id" element={<ProductId />} />
        <Route path="/user_dashboard" element={<UserListDash />} />
        <Route path="/product_dashboard" element={<ProductListDash />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}
