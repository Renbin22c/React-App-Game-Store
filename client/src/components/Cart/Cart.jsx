import React from "react";
import { Table } from "react-daisyui";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { PacmanLoader } from "react-spinners";
import { Button, Tooltip } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getCart, deleteCart } from "../../api/cart";
import { checkOutAll } from "../../api/storage";
import { CartItem } from "./CartItem";
import { GetToken } from "../../utils/helper";

export function Cart() {
  const token = GetToken();
  const { data, isLoading } = useQuery("cart", () =>
    getCart(localStorage.getItem("token"))
  );
  const queryClient = useQueryClient();
  const redirect = useNavigate();

  const { mutate: checkOutMutate } = useMutation(checkOutAll, {
    onSuccess: (data) => {
      Swal.fire("Success!", "Checkout success", "success");
      queryClient.invalidateQueries("cart");
      redirect("/storage");
    },
    onError: (err) => {
      Swal.fire("Oops", err.response.data.msg, "error");
    },
  });

  const { mutate: deleteMutate } = useMutation(deleteCart, {
    onSuccess: (data) => {
      Swal.fire("Deleted!", data.msg, "success");
      queryClient.invalidateQueries("cart");
    },
    onError: (err) => {
      Swal.fire("Oops", err.response.data.msg, "error");
    },
  });

  const checkoutHandler = (e) => {
    e.preventDefault();
    checkOutMutate({ data, token });
  };

  const deleteHandler = () => {
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
        deleteMutate(token);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="text-center text-3xl font-bold my-6">Cart</div>
      <Table className="mx-auto">
        <Table.Head>
          <span>Image</span>
          <span>Name</span>
          <span>Price</span>
          <span>
            {data.items ? (
              <>
                <Tooltip label="Delete All Products in Cart">
                  <Button size="sm" variant="ghost" onClick={deleteHandler}>
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </>
            ) : null}
          </span>
        </Table.Head>
        {data.items ? (
          <>
            <Table.Body>
              {data.items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </Table.Body>
            <Table.Footer>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>Total: RM {data.total}</span>
              <span>
                <form onSubmit={checkoutHandler}>
                  <Button type="submit">Checkout</Button>
                </form>
              </span>
            </Table.Footer>
          </>
        ) : (
          <>
            <Table.Body>
              <Table.Row>
                <div></div>
                <div>Your Cart is Empty</div>
                <div></div>
                <div></div>
              </Table.Row>
            </Table.Body>
            <Table.Footer>
              <span> </span>
              <span> </span>
              <span> </span>
              <span> </span>
            </Table.Footer>
          </>
        )}
      </Table>
    </div>
  );
}
