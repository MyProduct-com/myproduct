"use client";
import Link from "next/link";
import { IconHeart, IconTrash, IconShoppingCart } from "@tabler/icons-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { mockProducts } from "@/lib/mock-data";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const wishlistProducts = items.map((item) => {
    const product = mockProducts.find((p) => p.id === item.id);
    return product ?? null;
  }).filter(Boolean);

  const handleAddToCart = (id: string) => {
    const product = mockProducts.find((p) => p.id === id);
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
    remove(id);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <IconHeart size={22} className="text-red-500" />
        <h1 className="text-xl font-bold text-gray-900">
          Wishlist <span className="text-gray-400 font-normal">({items.length})</span>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <IconHeart size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Your wishlist is empty</p>
          <p className="text-sm text-gray-500 mb-4">
            Save items you love by clicking the heart icon on any product
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((product) => {
            if (!product) return null;
            return (
              <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-video bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 hover:text-green-700 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        KES {product.price.toLocaleString()}
                      </p>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          KES {product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => remove(product.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                        title="Remove from wishlist"
                      >
                        <IconTrash size={15} />
                      </button>
                      {product.status !== "out_of_stock" && (
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                          <IconShoppingCart size={14} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
