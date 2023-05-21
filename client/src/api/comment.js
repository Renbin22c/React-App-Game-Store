import axios from "axios";

export const getComments = async (id) => {
  const res = await axios.get(`http://localhost:5678/comments/${id}`);
  return res.data;
};

export const commentProduct = async ({ comment, token, id }) => {
  const res = await axios.post(
    `http://localhost:5678/comments/${id}`,
    comment,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
  return res.data;
};

export const updateComment = async ({ comment, token, id }) => {
  const res = await axios.put(`http://localhost:5678/comments/${id}`, comment, {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
};

export const deleteComment = async ({ token, id }) => {
  const res = await axios.delete(`http://localhost:5678/comments/${id}`, {
    headers: { "x-auth-token": token },
  });
  return res.data;
};
