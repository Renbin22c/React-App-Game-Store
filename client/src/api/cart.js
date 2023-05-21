import axios from "axios";

export async function getCart(token) {
  const res = await axios.get("http://localhost:5678/carts", {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
}

export async function addToCart({ id, token }) {
  const res = await axios.post(
    "http://localhost:5678/carts",
    { productId: id },
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
  return res.data;
}

export async function deleteCartItem({ id, token }) {
  const res = await axios.delete(`http://localhost:5678/carts/${id}`, {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
}

export async function deleteCart(token) {
  const res = await axios.delete("http://localhost:5678/carts", {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
}
