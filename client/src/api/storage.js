import axios from "axios";

export const checkOutAll = async ({ data, token }) => {
  const res = await axios.post("http://localhost:5678/storages", data, {
    headers: {
      "x-auth-token": token,
    },
  });

  // if (res.status === 200) window.location.href = res.data;
  return res.data;
};

export const getStorage = async (token) => {
  const res = await axios.get("http://localhost:5678/storages", {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
};
