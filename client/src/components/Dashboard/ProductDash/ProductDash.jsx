import React, { useState } from "react";
import { Table, Mask, Modal } from "react-daisyui";
import { Button, Flex, Tooltip } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { EditProduct } from "../../Form/EditProductForm";
import { useDisclosure } from "@chakra-ui/react";
import { useQueryClient, useMutation } from "react-query";
import { deleteProduct } from "../../../api/product";
import Swal from "sweetalert2";
import { GetToken } from "../../../utils/helper";
import { StarIcon } from "@chakra-ui/icons";
import { FaCheck, FaExclamation } from "react-icons/fa";

export function ProductDash({ product }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const token = GetToken();

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const { mutate } = useMutation(deleteProduct, {
    onSuccess: (data) => {
      Swal.fire("Deleted!", data.msg, "success");
      queryClient.invalidateQueries("products");
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
    <Table.Row hover>
      <div>
        <Mask
          variant="squircle"
          src={`http://localhost:5678${product.image.replace("image", "")}`}
          className="object-cover h-20 w-40"
        />
      </div>
      <div>
        <div className="font-bold">{product.name}</div>
        <div className="text-sm">{product.type}</div>
      </div>
      <div>
        <div className="font-bold">RM {product.price}</div>
        <div>
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < product.rating ? "teal.500" : "gray.300"}
              />
            ))}
        </div>
      </div>
      <span style={{ whiteSpace: "pre-line" }}>
        <div> {product.description.slice(0, 40)} </div>
        <Button size="xs" onClick={toggleVisible}>
          Read More
        </Button>
        <Modal open={visible}>
          <Modal.Header className="font-bold">Product Description</Modal.Header>
          <Modal.Body>{product.description}</Modal.Body>
          <Modal.Actions>
            <Button onClick={toggleVisible}>Close</Button>
          </Modal.Actions>
        </Modal>
      </span>
      <span>
        <div style={{ whiteSpace: "pre-line" }}>{product.developer}</div>
        <div style={{ whiteSpace: "pre-line" }}>{product.publisher}</div>
      </span>
      <span
        style={{
          wordWrap: "break-word",
          wordBreak: "break-all",
          whiteSpace: "break-spaces",
        }}
      >
        <Tooltip label="Video Url">
          <a href={product.video}> {product.video}</a>
        </Tooltip>
      </span>
      <span>{product.release_time}</span>
      <span>{product.comments.length}</span>
      <span>{product.likes.length}</span>
      <span className="flex">
        {!product.status ? (
          <>
            <Tooltip label="Unactive">
              <Button colorScheme="red" className="mt-4">
                <FaExclamation />
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip label="Active">
              <Button colorScheme="green" className="mt-4">
                <FaCheck />
              </Button>
            </Tooltip>
          </>
        )}
        <Flex direction="column">
          <Tooltip label="Edit Product">
            <Button size="sm" variant="ghost" onClick={onOpen}>
              <EditProduct
                isOpen={isOpen}
                onClose={onClose}
                product={product}
              />
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip label="Delete Product">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteHandler(product._id)}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Flex>
      </span>
    </Table.Row>
  );
}
