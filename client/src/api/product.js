import axios from "axios";

export const getProducts = async () => {
  const res = await axios.get("http://localhost:5678/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`http://localhost:5678/products/${id}`);
  return res.data;
};

export const addProduct = async ({ product, image, token }) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("description", product.description);
  formData.append("type", product.type);
  formData.append("status", product.status);
  formData.append("rating", product.rating);
  formData.append("developer", product.developer);
  formData.append("publisher", product.publisher);
  formData.append("image", image);
  formData.append("video", product.video);
  formData.append("release_time", product.release_time);
  const res = await axios.post("http://localhost:5678/products", formData, {
    headers: {
      "x-auth-token": token,
    },
  });
  return res.data;
};

export const updateProduct = async ({ editProduct, image, token }) => {
  let formData = new FormData();

  formData.append("name", editProduct.name);
  formData.append("price", editProduct.price);
  formData.append("description", editProduct.description);
  formData.append("type", editProduct.type);
  formData.append("status", editProduct.status);
  formData.append("rating", editProduct.rating);
  formData.append("developer", editProduct.developer);
  formData.append("publisher", editProduct.publisher);
  formData.append("image", image);
  formData.append("video", editProduct.video);
  formData.append("release_time", editProduct.release_time);

  const res = await axios.put(
    `http://localhost:5678/products/${editProduct._id}`,
    formData,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async ({ id, token }) => {
  const res = await axios.delete(`http://localhost:5678/products/${id}`, {
    headers: { "x-auth-token": token },
  });
  return res.data;
};

export const likeProduct = async ({ id, token }) => {
  const res = await axios.post(`http://localhost:5678/likes/${id}`, "", {
    headers: { "x-auth-token": token },
  });
  return res.data;
};
