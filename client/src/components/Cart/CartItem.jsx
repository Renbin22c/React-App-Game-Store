import React from "react";
import { Table, Mask } from "react-daisyui";
import { Button, Tooltip } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteCartItem } from "../../api/cart";
import { useQueryClient, useMutation } from "react-query";
import { GetToken } from "../../utils/helper";
import Swal from "sweetalert2";

export function CartItem({ item }) {
  const queryClient = useQueryClient();
  const token = GetToken();

  const { mutate } = useMutation(deleteCartItem, {
    onSuccess: (data) => {
      Swal.fire("Deleted!", data.msg, "success");
      queryClient.invalidateQueries("cart");
    },
    onError: (err) => {
      Swal.fire("Oops", err.response.data.msg, "error");
    },
  });

  const deleteHandler = (id) => {
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
        mutate({ id, token });
      }
    });
  };

  return (
    <Table.Row className="mx-auto">
      <span className="flex items-center space-x-3 truncate">
        <Mask
          className="object-cover h-20 w-40"
          variant="squircle"
          src={`http://localhost:5678${item.product.image.replace(
            "image",
            ""
          )}`}
        ></Mask>
      </span>
      <span>
        <span className="font-bold">{item.product.name}</span>
      </span>
      <span>RM {item.product.price}</span>
      <span>
        <Tooltip label="Delete Product in Cart">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteHandler(item.product._id)}
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
      </span>
    </Table.Row>
  );
}
