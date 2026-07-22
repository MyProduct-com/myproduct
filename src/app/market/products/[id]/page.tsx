"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconHeart,
  IconHeartFilled,
  IconShoppingCart,
  IconStar,
  IconTruck,
  IconShieldCheck,
  IconRefresh,
  IconMinus,
  IconPlus,
  IconMapPin,
  IconBuildingStore,
} from "@tabler/icons-react";
import { mockProducts } from "@/lib/mock-data";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = mockProducts.find((p) => p.id === id);

  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const isWishlisted = product ? inWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-lg font-semibold text-gray-900 mb-2">Product not found</p>
        <Link href="/products" className="text-green-600 hover:underline text-sm">
          Back to Products
        </Link>
      </div>
    );
  }

  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-green-600">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-green-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-50">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product image */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discount}% OFF
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
                NEW
              </div>
            )}
          </div>
        </div>

        {/* Product details */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              {product.category}
            </p>
            <button
              onClick={handleWishlist}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              {isWishlisted ? (
                <IconHeartFilled size={18} className="text-red-500" />
              ) : (
                <IconHeart size={18} />
              )}
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <IconStar
                  key={s}
                  size={16}
                  className={
                    s <= Math.round(product.rating)
                      ? "fill-orange-400 text-orange-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-green-600 font-medium">{product.sales} sold</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-gray-900">
              KES {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                KES {product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount && (
              <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Save KES {(product.originalPrice! - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-5">
            {product.status === "out_of_stock" ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg">
                Only {product.stock} left in stock, order soon
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Qty + Add to Cart */}
          {product.status !== "out_of_stock" && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <IconMinus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <IconPlus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <IconShoppingCart size={18} />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          )}

          {/* Delivery info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
            {[
              { icon: <IconTruck size={16} />, text: "Free delivery on orders over KES 2,000" },
              { icon: <IconMapPin size={16} />, text: "Same-day delivery available in Nairobi" },
              { icon: <IconRefresh size={16} />, text: "7-day hassle-free return policy" },
              { icon: <IconShieldCheck size={16} />, text: "100% genuine products guaranteed" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="text-green-600">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {/* Seller info */}
          <Link
            href={`/products?seller=${product.sellerId}`}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-green-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <IconBuildingStore size={18} className="text-green-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{product.sellerName}</p>
              <p className="text-xs text-gray-500">Verified Seller</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Brand", value: product.brand },
            { label: "SKU", value: product.sku },
            { label: "Category", value: product.category },
            { label: "In Stock", value: `${product.stock} units` },
          ].map((d) => (
            <div key={d.label}>
              <p className="text-xs text-gray-400 font-medium">{d.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{d.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
