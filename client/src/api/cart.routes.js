// client/src/api/cart.routes.js
import axiosAuth from "../axios/axiosAuth";

// GET the cart items for the logged user
export const fetchCartItems = async () => {
  try {
    const response = await axiosAuth.get("/cartitems");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return error.response?.data;
  }
};

// ADD item to cart
export const addToCartRequest = async (productId) => {
  try {
    const response = await axiosAuth.post("/cartitems", {
      productId,
      quantity: 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return error.response?.data;
  }
};

// UPDATE quantity of cart item
export const updateCartItem = async (id, quantity) => {
  try {
    const response = await axiosAuth.put(`/cartitems/${id}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return error.response?.data;
  }
};

// DELETE cart item
export const deleteCartItem = async (id) => {
  try {
    const response = await axiosAuth.delete(`/cartitems/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return error.response?.data;
  }
};
