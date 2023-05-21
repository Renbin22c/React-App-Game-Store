import React from "react";
import { Table } from "react-daisyui";
import { getUsers } from "../../../api/user";
import { useQuery } from "react-query";
import { UserDash } from "./UserDash";

export function UserListDash() {
  const { data } = useQuery("users", getUsers);

  return (
    <div className="overflow-x-auto">
      <div className="text-center text-3xl font-bold my-6">User List</div>
      <Table className="rounded-box mx-auto">
        <Table.Head>
          <span>User Image</span>
          <span>Name</span>
          <span>Introduce</span>
          <span>Country</span>
          <span>Gender</span>
          <span>Birthday</span>
          <span>Admin</span>
          <span></span>
        </Table.Head>

        <Table.Body>
          {data?.map((user) => (
            <UserDash key={user._id} user={user} />
          ))}
        </Table.Body>

        <Table.Footer>
          <span>User Image</span>
          <span>Name</span>
          <span>Introduce</span>
          <span>Country</span>
          <span>Gender</span>
          <span>Birthday</span>
          <span>Admin</span>
          <span></span>
        </Table.Footer>
      </Table>
    </div>
  );
}
