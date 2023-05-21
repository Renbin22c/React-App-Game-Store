import axios from "axios";

export const userRegister = async (registerData) => {
  const res = await axios.post(
    "http://localhost:5678/users/register",
    registerData
  );
  return res.data;
};

export const userLogin = async (loginData) => {
  const res = await axios.post("http://localhost:5678/users/login", loginData);
  return res.data;
};

export const getUserById = async ({ id, token }) => {
  const res = await axios.get(`http://localhost:5678/users/${id}`, {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
};

export const userUpdate = async (user) => {
  let formData = new FormData();
  formData.append("username", user.updateUser.username);
  formData.append("gender", user.updateUser.gender);
  formData.append("introduce", user.updateUser.introduce);
  formData.append("country", user.updateUser.country);
  formData.append("birthday", user.updateUser.birthday);
  formData.append("image", user.image);
  console.log(user.image);

  const res = await axios.put(
    `http://localhost:5678/users/${user.updateUser._id}`,
    formData,
    {
      headers: {
        "x-auth-token": user.token,
      },
    }
  );

  return res.data;
};

export const getUsers = async () => {
  const res = await axios.get("http://localhost:5678/users");
  return res.data;
};

export const deleteUser = async ({ id, token }) => {
  const res = await axios.delete(`http://localhost:5678/users/${id}`, {
    headers: { "x-auth-token": token },
  });
  return res.data;
};
