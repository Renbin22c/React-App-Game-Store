import React from "react";
import { Table } from "react-daisyui";
import { Button, Tooltip } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { GrUserAdmin, GrUser } from "react-icons/gr";
import { useQueryClient, useMutation } from "react-query";
import { deleteUser } from "../../../api/user";
import { GetToken } from "../../../utils/helper";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

export function UserDash({ user }) {
  const queryClient = useQueryClient();
  const token = GetToken();
  const decode = jwt_decode(token);

  const { mutate } = useMutation(deleteUser, {
    onSuccess: (data) => {
      Swal.fire("Deleted!", data.msg, "success");
      queryClient.invalidateQueries("users");
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
      <div className="flex justify-center">
        {user.image === null ? (
          <Avatar size={"md"} alt={"Avatar Alt"} />
        ) : (
          <Avatar
            size={"md"}
            alt={"user image"}
            src={`http://localhost:5678${user?.image.replace("image", "")}`}
          />
        )}
      </div>

      <div>
        <div className="font-bold">{user.username}</div>
        <div className="text-sm opacity-50">{user.email}</div>
      </div>
      <div>{user.introduce === null ? "---" : user.introduce}</div>
      <div>{user.country === null ? "---" : user.country}</div>
      <div>{user.gender === null ? "---" : user.gender}</div>
      <div>{user.birthday === null ? "---" : user.birthday}</div>
      <div>
        {user.isAdmin ? (
          <>
            <GrUserAdmin />
          </>
        ) : (
          <>
            <GrUser />
          </>
        )}
      </div>
      {decode.data._id === user._id ? null : (
        <>
          <Tooltip label="Delete Product">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteHandler(user._id)}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </>
      )}
    </Table.Row>
  );
}
