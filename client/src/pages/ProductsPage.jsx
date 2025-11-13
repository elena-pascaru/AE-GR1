// client/src/pages/ProductsPage.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts, deleteProduct } from '../api/product.routes';
import LoadingSpinner from '../components/LoadingSpinner';
import { addToCartRequest } from "../api/cart.routes";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const user = useSelector((state) => state.user.user); // user din token
  const isAdmin = user?.role === 'admin';

  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();

        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleEditClick = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteClick = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(productId);
      const response = await deleteProduct(productId);

      if (response?.success) {
        setProducts(products.filter((p) => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while deleting the product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateClick = () => {
    navigate('/products/create');
  };

  // add to Cart
  const handleAddToCart = async (product) => {
    const response = await addToCartRequest(product.id);

    if (response.success) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error(response.message || "Failed to add to cart");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No products available</p>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create First Product
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create Product
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">

          {products.map((product) => (
            <div key={product.id} className="group relative border p-3 rounded-lg shadow-sm">

              {/* Image */}
              <div className="relative">
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-md group-hover:opacity-75 transition"
                />

                {/* Admin buttons */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEditClick(product.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow-lg"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      disabled={deletingId === product.id}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-lg disabled:opacity-50"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">${product.price}</p>

                {/* Add to Cart - only for users */}
                {!isAdmin && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md font-medium transition"
                  >
                    Add to Cart
                  </button>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
