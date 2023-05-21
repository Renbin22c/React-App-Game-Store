import { useQuery } from "react-query";

export const GetToken = () => {
  //eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: token } = useQuery("getToken", () =>
    localStorage.getItem("token")
  );
  return token;
};

export const GetUserId = () => {
  //eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: user } = useQuery("getUser", () =>
    localStorage.getItem("user")
  );
  return user;
};
