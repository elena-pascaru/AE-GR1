// client/src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import axiosAuth from "../axios/axiosAuth";
import { fetchCartItems, updateCartItem, deleteCartItem } from "../api/cart.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

export default function CartPage() {
    const [items, setItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0); // the initial totalCost = 0
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await fetchCartItems();

            if (response.success) {
                setItems(response.data.items);
                setTotalCost(response.data.totalCost);
            } else {
                toast.error("Failed to load cart");
            }
        } catch (err) {
            toast.error(err.message || 'An error occurred while fetching cart items');
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingId(id);
            const response = await updateCartItem(id, newQuantity);

            if (response.success) {
                toast.success("Quantity updated");
                loadCart();
            } else {
                toast.error("Failed to update quantity");
            }
        } catch (err) {
            toast.error(err.message || 'An error occurred while updating quantity');
            console.error('Error updating quantity:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Remove item from cart?")) return;

        try {
            setDeletingId(id);
            const response = await deleteCartItem(id);

            if (response.success) {
                toast.success("Item removed");
                loadCart();
            } else {
                toast.error("Failed to remove item");
            }
        } catch (err) {
            toast.error(err.message || 'An error occurred while removing the item');
            console.error('Error removing item:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleOrder = async () => {
        if (!confirm("Submit order?")) return;

        try {
            // Update the remaining stock
            for (const item of items) {
                const newStock = item.Product.stock - item.quantity;

                if (newStock < 0) {
                    toast.error(`Insufficient stock for ${item.Product.name}`);
                    return;
                }
            }

            for (const item of items) {
                const newStock = item.Product.stock - item.quantity;

                await axiosAuth.put(`/products/${item.productId}`, {
                    stock: newStock
                });
            }

            // Empty Shopping Cart
            for (const item of items) {
                await deleteCartItem(item.id);
            }

            toast.success("Order submitted! Thank you for shopping!");

            // Reload cart
            loadCart();

        } catch (err) {
            toast.error("Order failed");
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (items.length === 0)
        return (
            <div className="h-screen bg-white flex justify-center items-center">
                <p className="text-gray-500 text-lg">Your Shopping Cart is empty</p>
            </div>
        );

    return (
        <div className="bg-white h-screen overflow-y-auto p-10">
            <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

            <div className="space-y-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-6 p-4 border rounded-md shadow-sm"
                    >
                        <img
                            src={item.Product.image || "https://via.placeholder.com/120"}
                            alt={item.Product.name}
                            className="w-28 h-28 rounded-md object-cover"
                        />

                        <div className="flex-1">
                            <h2 className="text-lg font-semibold">{item.Product.name}</h2>
                            <p className="text-gray-500">{item.Product.category}</p>
                            <p className="text-gray-700 font-medium mt-2">${item.Product.price}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    handleQuantityChange(item.id, item.quantity - 1)
                                }
                                disabled={updatingId === item.id}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                -
                            </button>

                            <span className="text-lg font-semibold">{item.quantity}</span>

                            <button
                                onClick={() =>
                                    handleQuantityChange(item.id, item.quantity + 1)
                                }
                                disabled={updatingId === item.id}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                +
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-4 border-t">
                <h3 className="text-xl font-bold">
                    Total: ${totalCost.toFixed(2)}
                </h3>

                <button
                    onClick={handleOrder}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold"
                >
                    Order
                </button>
            </div>
        </div>
    );
}
